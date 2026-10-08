# Two-dimensional EPR (0.3.0)

Open the 2D Map toolbar button, then select one CIQTEK 2D EPR file or a matching BES3T DSC/DTA pair. Include XGF/YGF when declared as IGD. Axes must be strictly monotonic. Unknown units remain as supplied; no guessed units or attenuation coordinates are inserted.

CIQTEK transient EPR stores time in ns along X and field in G along Y. The viewer automatically swaps these for a field-horizontal map. Field–power files read attenuation from each trace's params.power in dB. Real, imaginary and magnitude components are preserved separately.

The X projection defaults to a mean over the selected Y interval; the Y projection defaults to RMS over the selected X interval, following the supplied MATLAB reference. Mean and sum are sample-based, not coordinate-weighted integrals. RMS is nonnegative and does not retain phase sign. Stack offsets only affect display.

Heatmaps use a symmetric blue–white–red scale and exact midpoint cell edges, including nonuniform coordinates. Missing signal cells are left blank. SVG export contains vector cells, curves and text. A 250,000-cell vector limit is enforced explicitly; narrow ranges or use Stack for larger maps. PDF and integration with the 1D project format are not implemented for this viewer. 2D uses its own versioned project file and projection CSV.

Verification: node src/twod/core.test.js; npm run build. Synthetic tests cover transpose, projection intervals, mean/RMS, endian decoding, matrix dimensions and invalid axes. Real instrument data and full browser interaction still require validation.
