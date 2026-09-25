#!/usr/bin/env python3
"""WCAG contrast of one text color against several surfaces.

Usage: python3 contrast.py "#texte" "#fond1" ["#fond2" ...]
Exit code 1 when a pair is under 4.5:1.
"""

import sys


def luminance(hex_color):
    value = hex_color.lstrip('#')
    if len(value) == 3:
        value = ''.join(char * 2 for char in value)
    channels = [int(value[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    linear = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]


def ratio(first, second):
    light, dark = sorted((luminance(first), luminance(second)), reverse=True)
    return (light + 0.05) / (dark + 0.05)


if len(sys.argv) < 3:
    print(__doc__)
    sys.exit(2)

text, surfaces = sys.argv[1], sys.argv[2:]
failed = False
for surface in surfaces:
    value = ratio(text, surface)
    verdict = 'AA' if value >= 4.5 else ('AA grand texte seulement' if value >= 3 else 'ÉCHEC')
    failed = failed or value < 4.5
    print(f'{text} sur {surface} : {value:.2f}:1  {verdict}')

sys.exit(1 if failed else 0)
