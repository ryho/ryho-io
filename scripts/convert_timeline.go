// Convert Google Timeline exports into the JavaScript data used by the map.
// Run from the project root: go run scripts/convert_timeline.go [flags] Timeline.json
package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"
)

type Point [2]float64
type RouteBreak struct {
	Points [2]Point  `json:"points"`
	Dates  [2]string `json:"dates"`
}
type Sample struct {
	Time  time.Time
	Point Point
}
type PathPoint struct {
	Point  string      `json:"point"`
	Offset json.Number `json:"durationMinutesOffsetFromStartTime"`
}
type Record struct {
	Start    string      `json:"startTime"`
	End      string      `json:"endTime"`
	Path     []PathPoint `json:"timelinePath"`
	Activity *struct {
		Start string `json:"start"`
		End   string `json:"end"`
	} `json:"activity"`
}

func coordinate(value string) (Point, error) {
	parts := strings.Split(strings.TrimPrefix(value, "geo:"), ",")
	if len(parts) != 2 {
		return Point{}, fmt.Errorf("invalid coordinate")
	}
	var p Point
	for i := range p {
		v, err := strconv.ParseFloat(parts[i], 64)
		if err != nil || math.IsNaN(v) || math.IsInf(v, 0) {
			return p, fmt.Errorf("invalid coordinate number")
		}
		p[i] = v
	}
	if math.Abs(p[0]) > 90 || math.Abs(p[1]) > 180 {
		return p, fmt.Errorf("coordinate outside latitude/longitude bounds")
	}
	return p, nil
}

func distance(a, b Point) float64 {
	rad := math.Pi / 180
	lat1, lat2 := a[0]*rad, b[0]*rad
	h := math.Pow(math.Sin((lat2-lat1)/2), 2) + math.Cos(lat1)*math.Cos(lat2)*math.Pow(math.Sin((b[1]-a[1])*rad/2), 2)
	return 6371 * 2 * math.Asin(math.Sqrt(math.Max(0, math.Min(1, h))))
}

// Default excluded dates (inclusive). Add ranges here, or supply --omit flags.
var defaultOmissions = []string{
	"2026-03-13:2026-03-15", // Driving to Atlanta for documents
	"2025-10-13:2025-10-13", // Driving to storage unit after Randy's Wedding
}

type dateRange struct{ Start, End string }
type omitFlags []string

func (f *omitFlags) String() string         { return strings.Join(*f, ", ") }
func (f *omitFlags) Set(value string) error { *f = append(*f, value); return nil }

func parseOmissions(values []string) ([]dateRange, error) {
	var ranges []dateRange
	for _, value := range values {
		parts := strings.Split(value, ":")
		if len(parts) == 1 {
			parts = append(parts, parts[0])
		}
		if len(parts) != 2 {
			return nil, fmt.Errorf("invalid omit range %q: use YYYY-MM-DD:YYYY-MM-DD", value)
		}
		for _, date := range parts {
			if _, err := time.Parse("2006-01-02", date); err != nil {
				return nil, fmt.Errorf("invalid omit date: %w", err)
			}
		}
		if parts[0] > parts[1] {
			return nil, fmt.Errorf("omit range start is after end: %s", value)
		}
		ranges = append(ranges, dateRange{parts[0], parts[1]})
	}
	return ranges, nil
}

// Remove only isolated spikes: both adjacent legs are implausible, but
// bypassing the middle point is plausible. Sustained fast travel is retained.
func filterSpikes(samples []Sample, maxSpeed float64) ([]Sample, int) {
	speed := func(a, b Sample) float64 {
		km := distance(a.Point, b.Point)
		if km < 1 {
			return 0
		} // Allow small GPS jitter.
		hours := b.Time.Sub(a.Time).Hours()
		if hours <= 0 {
			return math.Inf(1)
		}
		return km / hours
	}
	result := make([]Sample, 0, len(samples))
	removed := 0
	for i, current := range samples {
		if len(result) > 0 && i+1 < len(samples) {
			previous, next := result[len(result)-1], samples[i+1]
			if speed(previous, current) > maxSpeed && speed(current, next) > maxSpeed && speed(previous, next) <= maxSpeed {
				removed++
				continue
			}
		}
		result = append(result, current)
	}
	return result, removed
}

// A stop is a consecutive cluster within radius of its first point.
// Long recording gaps do not establish continuous presence.
func stopPoints(samples []Sample, radius, hours, maxGap float64) []bool {
	result := make([]bool, len(samples))
	for start := 0; start < len(samples); {
		end := start + 1
		for end < len(samples) && samples[end].Time.Sub(samples[end-1].Time).Hours() <= maxGap && distance(samples[start].Point, samples[end].Point) <= radius {
			end++
		}
		if samples[end-1].Time.Sub(samples[start].Time).Hours() > hours {
			for i := start; i < end; i++ {
				result[i] = true
			}
		}
		start = end
	}
	return result
}

func run() error {
	output := flag.String("output", "data/travel-paths.js", "Output file (relative to current directory)")
	start := flag.String("start", "2025-07-23", "Inclusive start date")
	end := flag.String("end", "2026-10-09", "Inclusive end date")
	grid := flag.Float64("grid", 0.03, "Coordinate rounding in degrees for stops only")
	gap := flag.Float64("gap-hours", 6, "Split route after this time gap")
	jump := flag.Float64("jump-km", 100, "Split route across larger jumps")
	maxSpeed := flag.Float64("max-speed-kmh", 1200, "Remove isolated spikes exceeding this speed on both sides")
	stopRadius := flag.Float64("stop-radius-km", 1, "Maximum stop cluster radius")
	stopHours := flag.Float64("stop-hours", 1, "Round stops lasting strictly longer than this")
	var omissions omitFlags
	flag.Var(&omissions, "omit", "Inclusive omitted date or START:END; repeat for multiple ranges (replaces defaults)")
	flag.Parse()
	if len(omissions) == 0 {
		omissions = defaultOmissions
	}
	excluded, err := parseOmissions(omissions)
	if err != nil {
		return err
	}
	if flag.NArg() != 1 {
		return fmt.Errorf("usage: go run scripts/convert_timeline.go [flags] Timeline.json (flags go before input)")
	}
	for _, date := range []string{*start, *end} {
		if _, err := time.Parse("2006-01-02", date); err != nil {
			return err
		}
	}
	for _, v := range []float64{*grid, *gap, *jump, *maxSpeed, *stopRadius, *stopHours} {
		if v <= 0 || math.IsNaN(v) || math.IsInf(v, 0) {
			return fmt.Errorf("thresholds must be finite and positive")
		}
	}
	if *start > *end {
		return fmt.Errorf("start must be before end")
	}
	data, err := os.ReadFile(flag.Arg(0))
	if err != nil {
		return err
	}
	data = bytes.TrimSpace(data)
	if len(data) > 0 && data[0] == '{' {
		var wrapper struct {
			Segments json.RawMessage `json:"semanticSegments"`
		}
		if err := json.Unmarshal(data, &wrapper); err != nil {
			return err
		}
		if len(wrapper.Segments) == 0 {
			return fmt.Errorf("missing semanticSegments")
		}
		data = wrapper.Segments
	}
	var records []Record
	if err := json.Unmarshal(data, &records); err != nil {
		return err
	}
	samples := []Sample{}
	fallback := []Sample{}
	addingFallback := false
	// Retain excluded samples as break markers, then remove them while drawing.
	omitted := func(date string) bool {
		for _, r := range excluded {
			if r.Start <= date && date <= r.End {
				return true
			}
		}
		return false
	}
	add := func(t time.Time, value string) error {
		date := t.Format("2006-01-02")
		if date < *start || date > *end {
			return nil
		}
		p, err := coordinate(value)
		if err != nil {
			return err
		}
		if addingFallback {
			fallback = append(fallback, Sample{t, p})
		} else {
			samples = append(samples, Sample{t, p})
		}
		return nil
	}
	// Visits and identifying metadata are excluded; activity endpoints are sparse fallbacks.
	for i, r := range records {
		addingFallback = false
		base, err := time.Parse(time.RFC3339Nano, r.Start)
		if err != nil {
			return fmt.Errorf("record %d start: %w", i, err)
		}
		if r.Path != nil {
			for _, p := range r.Path {
				minutes, err := p.Offset.Float64()
				if err != nil || math.IsNaN(minutes) || math.IsInf(minutes, 0) || math.Abs(minutes) > 1e8 {
					return fmt.Errorf("record %d invalid time offset", i)
				}
				if err := add(base.Add(time.Duration(minutes*float64(time.Minute))), p.Point); err != nil {
					return fmt.Errorf("record %d: %w", i, err)
				}
			}
		} else if r.Activity != nil {
			addingFallback = true
			finish, err := time.Parse(time.RFC3339Nano, r.End)
			if err != nil {
				return err
			}
			if err := add(base, r.Activity.Start); err != nil {
				return err
			}
			if err := add(finish, r.Activity.End); err != nil {
				return err
			}
		}
	}
	// Prefer detailed GPS within five minutes of each activity endpoint.
	sort.SliceStable(samples, func(i, j int) bool { return samples[i].Time.Before(samples[j].Time) })
	gps := append([]Sample(nil), samples...)
	skipped := 0
	for _, point := range fallback {
		at := sort.Search(len(gps), func(i int) bool { return !gps[i].Time.Before(point.Time) })
		covered := (at < len(gps) && gps[at].Time.Sub(point.Time) <= 5*time.Minute) || (at > 0 && point.Time.Sub(gps[at-1].Time) <= 5*time.Minute)
		if covered {
			skipped++
			continue
		}
		samples = append(samples, point)
	}
	sort.SliceStable(samples, func(i, j int) bool { return samples[i].Time.Before(samples[j].Time) })
	samples, removed := filterSpikes(samples, *maxSpeed)
	fmt.Printf("Skipped %d activity endpoints covered by GPS; removed %d isolated unrealistic points\n", skipped, removed)

	paths := map[string][][]Point{}
	dates := map[string][][]string{}
	breaks := map[string][]RouteBreak{}
	stops := stopPoints(samples, *stopRadius, *stopHours, *gap)
	rounded := func(index int) Point {
		raw := samples[index].Point
		if !stops[index] {
			return raw
		}
		var p Point
		for j, v := range raw {
			p[j] = math.RoundToEven(math.RoundToEven(v / *grid)**grid*1e6) / 1e6
		}
		return p
	}
	var lineDates []string
	var line []Point
	month := ""
	flush := func() {
		if len(line) > 1 {
			paths[month] = append(paths[month], append([]Point(nil), line...))
			dates[month] = append(dates[month], append([]string(nil), lineDates...))
		}
		line = nil
		lineDates = nil
	}
	for i, s := range samples {
		if omitted(s.Time.Format("2006-01-02")) {
			flush()
			continue
		}
		blocked := false
		// Also split if an excluded interval falls between two sparse samples.
		if i > 0 {
			previousDate := samples[i-1].Time.Format("2006-01-02")
			currentDate := s.Time.Format("2006-01-02")
			for _, r := range excluded {
				if previousDate <= r.End && currentDate >= r.Start {
					blocked = true
					flush()
					break
				}
			}
		}
		key := s.Time.Format("2006-01")
		if i > 0 && (key != month || s.Time.Sub(samples[i-1].Time).Hours() > *gap || distance(samples[i-1].Point, s.Point) > *jump) {
			if !blocked && !omitted(samples[i-1].Time.Format("2006-01-02")) {
				a, b := rounded(i-1), rounded(i)
				if a != b {
					breaks[key] = append(breaks[key], RouteBreak{[2]Point{a, b}, [2]string{samples[i-1].Time.Format(time.RFC3339), s.Time.Format(time.RFC3339)}})
				}
			}
			flush()
		}
		month = key
		p := rounded(i)
		date := s.Time.Format(time.RFC3339)
		if len(line) == 0 || p != line[len(line)-1] || date[:10] != lineDates[len(lineDates)-1][:10] {
			line = append(line, p)
			lineDates = append(lineDates, date)
		}
	}
	flush()
	if len(paths) == 0 {
		return fmt.Errorf("no drawable route data; output left unchanged")
	}
	encoded, err := json.Marshal(paths)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(*output), 0755); err != nil {
		return err
	}
	dateJSON, err := json.Marshal(dates)
	if err != nil {
		return err
	}
	breakJSON, err := json.Marshal(breaks)
	if err != nil {
		return err
	}
	contents := "// Generated by scripts/convert_timeline.go\nconst paths=" + string(encoded) + ";\nconst pathDates=" + string(dateJSON) + ";\nconst routeBreaks=" + string(breakJSON) + ";\n"
	if err := os.WriteFile(*output, []byte(contents), 0644); err != nil {
		return err
	}

	count := 0
	for _, lines := range paths {
		for _, p := range lines {
			count += len(p)
		}
	}
	fmt.Printf("Wrote %d months and %d points to %s\n", len(paths), count, *output)
	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
