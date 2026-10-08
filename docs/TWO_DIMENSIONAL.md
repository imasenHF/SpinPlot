# Two-dimensional EPR (0.4.0)

Use the existing Open Data control for 1D and 2D files. Each recognized 2D dataset creates an independent subplot. Its 2D details section opens automatically. Supported formats: CIQTEK transient and field-power EPR; BES3T DSC/DTA, with XGF/YGF for IGD axes. Multiple 1D and 2D datasets may be selected together.

Use the standard Plot mode for heatmap/stack and Offset scale for stack amplitude. The 2D section holds signal component, swap and stack interval. X/Y/Z ranges and axis/colorbar labels share the axis override fold; palettes share the color override fold; spacing shares advanced layout. Projection methods, independent ranges, titles and range-label positions have their own projection fold. Projection CSV is in Export, selected per subplot. Methods include mean, maximum, minimum, peak-to-peak, RMS and sum. Default X projection is a sample mean over selected Y; Y projection is sample RMS over selected X, following the MATLAB reference. These are not coordinate-weighted integrals. RMS discards the sign.

No cell-count restriction is imposed. Preview renders to canvas pixels with nearest-cell selection using physical axis coordinates, including nonuniform coordinates. Every selected data point contributes to projections and color bounds. Preview resampling never modifies raw arrays. Large vector SVG/PDF exports preserve cells and may produce large files and take substantial time. Other image exports use canvas rendering. Actual capacity depends on browser memory and file size.

CIQTEK transient time is ns and field is G. The viewer swaps time-first data to field-horizontal by default. Field-power attenuation comes from params.power in dB, with no guessed coordinates. Unknown BES3T axis units remain as supplied.

Save Project includes matrices and 2D settings in SpinPlot project format 11. Older 1D project versions 9 and 10 remain readable. Clear config restores default 2D settings while retaining data. The 2D fold state is stored in config. Wheel zoom, Shift X pan, Ctrl Y pan use 2D bounds. Double click fits both 2D axes. One-dimensional noise selection and ΔB marking do not operate on 2D maps.

Validation: npm run build; node src/twod/core.test.js; node src/twod/large.test.js. Synthetic tests cover 1,002,000 cells, full mean/RMS projections, caching, pixel-based preview and matrix restoration; axis transpose and endian decoding. Real instrument files and full browser interaction still require validation.

## 0.5.0 layout and controls

Projection frames have coordinate ticks and intensity tick labels. Layout follows the uploaded MATLAB reference: X projection above the map, Y projection to the right, then colorbar. Projection X/Y selection ranges are stored separately from display X/Y bounds; labels are shown inside the projection plots by default and may be switched off. Colorbar min/max may be entered or adjusted with the wheel over the bar. Auto Z restores automatic min/max. All gradient palettes use the shared application palette registry.

The ordinary subplot panel remains visible. Subplot title, global font sizes and line width, frame/grid, axis overrides, Y tick/title visibility, annotations in acquisition coordinates, color override, layout and subplot ordering apply to 2D. The existing frequency configuration provides the frequency for g conversion. g may be displayed for either magnetic-field axis; G, gauss, Oe, mT and T are converted consistently. The g-axis layout reserves space between projection and map. Signal processing of 1D traces does not alter the matrix. Heatmap palette has a local selector, or may inherit any continuous subplot/global palette; categorical palettes fall back to turbo for the heatmap.

BES3T now shares one 1D/2D reader, including irregular XGF/YGF coordinates, REAL/CPLX interleaving, BIG/LIT byte order and C/S/I/F/D formats. Missing companions, wrong data lengths, incompatible real/imaginary formats, 3D and multichannel layouts are reported explicitly. No automatic acquisition-gain/scan/power normalization is performed. The uploaded private loaders identify future formats (Bruker ESP, JEOL, Magnettech, Adani and others); these are reference material only, not current supported formats.

Checks: node src/twod/bes3t.test.js additionally covers independent projection intervals, both endian sequences, descending/irregular axes, complex data, 1D irregular field axes and every continuous palette.

## Shared workflow (0.6.0)

Open appends new files to new subplots when data are already loaded. Existing subplot settings and annotations remain. Clear all data empties the session; Clear config retains imported data. Titles are centered over the main map and never fall back to the source filename. Projection lines use the first color of their selected categorical/continuous palette; heatmap and stack gradients are set separately. The file axis labels and units identify field, time, power/attenuation, angle, temperature and modulation amplitude. Modulation amplitude is not treated as a field axis for g conversion.

Checks: node src/twod/integration.test.js covers acquisition types, unit conversion, g in both orientations, map-centered titles, projection palettes and CSV. Live browser checks covered shared folds, g spacing, projection export placement, append (two datasets/two subplots) and clearing (zero datasets).

## Controls and interaction (0.7.0)

Projection gaps default to 20 px in two half-width fields spanning one row. 2D g axes start off with local settings; edits to local g fields select local override. Stack every N traces is enabled only in Stack view. Range labels start inside the top-left of the upper projection and top-right of the right projection. Label position and legend position folds start closed. Subplot palette selectors show the selected palette swatch.

Wheel zoom and Shift/Ctrl pan operate in projection frames as in the main frame. Upper projection X and right projection Y are the same acquisition coordinates as the map and always remain linked. The other projection axes are independent intensity ranges, with automatic or manual limits in Projections. Double click restores the selected projection intensity and acquisition coordinate axes. These display controls do not change the independent range used to calculate projection statistics.

### Z axis and coordinate grids

Axes exposes the colorbar title, title distance, Z range, tick step and tick visibility. Titles are hidden by default. Local Z bounds share a row and automatically select local override when edited or adjusted with the colorbar wheel. Existing saved local Z bounds remain local.

IDX axes use DSC bounds without XGF/YGF. IGD axes use an available grid file; when absent, valid axis MIN/WID bounds provide a uniform coordinate fallback. Missing both the grid and bounds reports an error.

### CIQTEK experimental EPR files

Recognized types: CW 1D Field/Time Sweep; CW 2D Field-Power, Field-Delay, Field-Modul.Amp., Time-Field Sweep; Transient 2D Tr-EPR. Coordinates are read from ReData and each trace params, not its ordinal number. Imaginary channels and trace frequencies are retained. Rows are sorted with their channels; duplicate/missing coordinates and mismatched trace grids are rejected. Unknown experiments report an error instead of silently reading the first trace.

Time units follow dataStore.xAxisName (CW examples: ms; transient default: ns). Power trace params record attenuation in dB. Modulation amplitude uses G. Field-delay examples do not declare a delay unit, so the original values remain unitless with an import notice.

Run `node src/twod/ciq.test.js /path/to/extracted/experiments` for exact comparison of coordinates and both signal channels with the six supplied examples. Private input data are not included in the repository.
