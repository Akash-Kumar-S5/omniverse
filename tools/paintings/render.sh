#!/bin/sh
# Renders the 8 project motif paintings (tools/paintings/N.svg) to public/assets/paintings/painting_N.webp over a warm radial base.
cd "$(dirname "$0")"
for i in 0 1 2 3 4 5 6 7; do
  magick -size 1024x1365 radial-gradient:'#6a4524'-'#120a05' \( -background black -density 96 $i.svg \) -compose Lighten -composite \
    -attenuate 0.2 +noise Gaussian -blur 0x1 -quality 82 ../../public/assets/paintings/painting_$i.webp
done
