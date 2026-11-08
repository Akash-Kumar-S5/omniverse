# Round 2 plan (written after round-1 scores; Morph makes the final call)
Scores round 1 (main 5c8fdcc/995ba7b): agy-review avg 8.36 (ch0 8.5, ch1 8.5, ch2 8.2, ch3 7.8, ch4 8.8); copilot-review avg 6.7 (ch0 6.5, ch1 7.5, ch2 7.0, ch3 5.5, ch4 7.0). Reviewers disagree by 1.6: weight Morph's eye and copilot's specifics (it cites benchmark objects).
Top 3 upgrades (impact order), owner agy-world unless noted, one bounded copilot turn for item 3:
1. HERO OBJECT PER CHAPTER, starting ch3: replace the blurred grey slabs-as-subject with a lit readable subject per project (framed screen / artefact that changes per project, beside the active slab); ch0 particle form reads as a shaped, lit form (assembles from noise on load), clear of the name and not clipped at the right edge.
   Reuse first: drei Float, MeshReflectorMaterial, RoundedBox, Text3D/Html, existing sanctum.spots anchors. Acceptance: ?skipgate&chapter=0 and 3 shots at 1440 and 390; label visible.
2. TEXT-OVER-SCENE LEGIBILITY: ch2 ribbon off the role card, ch4 halo off the paragraph (local soft dark gradient in the scene or shift the focal object); ch3 project label no longer hidden. Acceptance: chapter 2,3,4 shots, text contrast intact.
3. CONTINUOUS CAMERA + SIGNATURE INTERACTION (copilot bounded, one turn each): one scroll-linked dolly with DoF rack-focus pull between chapters; cursor relights the bust/particles; tactile hover on project Next. Acceptance: before/after pair + fps >= 55 HIGH.
Perf guard: no regression below DONE s3. Stop rule: overall >= 8.5 both reviewers + Morph, or round 4, or two rounds < +0.5.
