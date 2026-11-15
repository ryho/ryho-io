package main

import (
	"testing"
	"time"
)

func TestFilterSpikes(t *testing.T) {
	base := time.Date(2026, 3, 28, 17, 43, 0, 0, time.UTC)
	makeSample := func(seconds int, p Point) Sample { return Sample{base.Add(time.Duration(seconds) * time.Second), p} }
	cases := []struct {
		name    string
		points  []Sample
		removed int
	}{
		{"isolated jump", []Sample{makeSample(0, Point{32.88, -111.72}), makeSample(6, Point{32.07, -112.77}), makeSample(60, Point{32.88, -111.69})}, 1},
		{"sustained flight", []Sample{makeSample(0, Point{33, -112}), makeSample(3600, Point{38, -105}), makeSample(7200, Point{40, -98})}, 0},
		{"normal drive", []Sample{makeSample(0, Point{33, -112}), makeSample(3600, Point{33.5, -112}), makeSample(7200, Point{34, -112})}, 0},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got, n := filterSpikes(c.points, 1200)
			if n != c.removed || len(got) != len(c.points)-c.removed {
				t.Fatalf("removed %d, expected %d", n, c.removed)
			}
		})
	}
}

func TestStopPoints(t *testing.T) {
	base := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)
	sample := func(min int, p Point) Sample { return Sample{base.Add(time.Duration(min) * time.Minute), p} }
	for _, c := range []struct {
		name   string
		points []Sample
		want   bool
	}{
		{"over hour", []Sample{sample(0, Point{33, -112}), sample(30, Point{33.001, -112}), sample(61, Point{33, -112})}, true},
		{"exact hour", []Sample{sample(0, Point{33, -112}), sample(60, Point{33, -112})}, false},
		{"moving", []Sample{sample(0, Point{33, -112}), sample(61, Point{34, -112})}, false},
		{"recording gap", []Sample{sample(0, Point{33, -112}), sample(600, Point{33, -112})}, false},
	} {
		t.Run(c.name, func(t *testing.T) {
			for _, v := range stopPoints(c.points, 1, 1, 6) {
				if v != c.want {
					t.Fatalf("got %v want %v", v, c.want)
				}
			}
		})
	}
}

func TestExcludedJapanFlights(t *testing.T) {
	if !excludedFlight(Point{34.77, 138}, Point{34.71, 137.73}) {
		t.Fatal("false Japan flight retained")
	}
	if excludedFlight(Point{41.97, -87.9}, Point{35.55, 139.77}) {
		t.Fatal("arrival in Japan removed")
	}
	if excludedFlight(Point{35.55, 139.77}, Point{40.71, -74.19}) {
		t.Fatal("departure from Japan removed")
	}
	if excludedFlight(Point{47.45, -122.31}, Point{19.74, -156.03}) {
		t.Fatal("Hawaii flight removed")
	}
}
