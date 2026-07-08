import { useState } from "react";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { isValid as isValidDate } from "date-fns";
import type { FeatureCollection } from "geojson";
import { GeoFilterMap } from "../../../../common/components/GeoFilterMap/GeoFilterMap";
import { MultiSelectField } from "../../../../common/components/MultiSelectField/MultiSelectField";
import { LARGE_FILE_TYPE_OPTIONS } from "../../../../common/constants/fileTypes";
import { serializeDate } from "../../../../common/utils/date";
import type { AppliedFilters } from "../../queries/useLargeFileSearch";
import { ACCURACY_MAX, ACCURACY_MIN } from "../../types";
import {
  Actions,
  Field,
  FormCard,
  MapField,
  MapFrame,
} from "../../LargeFileRequest.styles";
import {
  DateRow,
  FieldHeader,
  FieldWide,
  FiltersGrid,
  SliderWrap,
} from "./LargeFileRequestForm.styles";
import type { GeoLayer } from "../../../../common/geo/geo.types";

const DEFAULT_ACCURACY = 7;

type LargeFileRequestFormProps = {
  onSearch: (filters: AppliedFilters) => void;
  searching?: boolean;
};

export const LargeFileRequestForm = ({
  onSearch,
  searching,
}: LargeFileRequestFormProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState(DEFAULT_ACCURACY);
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [areaLayers, setAreaLayers] = useState<GeoLayer[]>([]);

  const endBeforeStart =
    Boolean(startDate && endDate) &&
    isValidDate(startDate!) &&
    isValidDate(endDate!) &&
    endDate! < startDate!;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (endBeforeStart) return;

    const fileTypes = selectedTypes;
    const trimmedCountry = country.trim();
    const start = serializeDate(startDate);
    const end = serializeDate(endDate);

    
    const features = areaLayers.flatMap((layer) => layer.data.features);
    const area: FeatureCollection | undefined = features.length
      ? { type: "FeatureCollection", features }
      : undefined;

    onSearch({
      accuracy,
      ...(fileTypes.length ? { fileTypes } : {}),
      ...(trimmedCountry ? { country: trimmedCountry } : {}),
      ...(start ? { startDate: start } : {}),
      ...(end ? { endDate: end } : {}),
      ...(area ? { area } : {}),
    });
  };

  return (
    <FormCard onSubmit={handleSubmit}>
      <FiltersGrid>
        <FieldWide>
          <MultiSelectField
            label="File types"
            emptyText="Any type"
            options={LARGE_FILE_TYPE_OPTIONS}
            value={selectedTypes}
            onChange={setSelectedTypes}
            allowCustom
            helperText="Pick from the list or type your own and press Enter."
          />
        </FieldWide>

        <Field>
          <Typography variant="subtitle2">Country</Typography>
          <TextField
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Any country"
            size="small"
            fullWidth
          />
        </Field>

        <Field>
          <FieldHeader>
            <Typography variant="subtitle2">Accuracy</Typography>
            <Typography variant="body2" color="text.secondary">
              matching {Math.max(ACCURACY_MIN, accuracy - 1)}–
              {Math.min(ACCURACY_MAX, accuracy + 1)}
            </Typography>
          </FieldHeader>
          <SliderWrap>
            <Slider
              value={accuracy}
              onChange={(_, value) => setAccuracy(value as number)}
              min={ACCURACY_MIN}
              max={ACCURACY_MAX}
              step={1}
              valueLabelDisplay="auto"
            />
          </SliderWrap>
        </Field>

        <FieldWide>
          <Typography variant="subtitle2">Coverage date</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRow>
              <DatePicker
                label="Start date"
                format="dd/MM/yyyy"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: "small" } }}
              />
              <DatePicker
                label="End date"
                format="dd/MM/yyyy"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: {
                    size: "small",
                    error: endBeforeStart,
                    helperText: endBeforeStart ? "End must be after start" : " ",
                  },
                }}
              />
            </DateRow>
          </LocalizationProvider>
        </FieldWide>
      </FiltersGrid>

      <MapField>
        <Typography variant="subtitle2">
          Search area{" "}
          <Typography component="span" variant="body2" color="text.secondary">
            — drop a KML, GeoJSON, SHP, CSV or Excel file on the map.
          </Typography>
        </Typography>
        <MapFrame>
          <GeoFilterMap onChange={setAreaLayers} />
        </MapFrame>
      </MapField>

      <Actions>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SearchRoundedIcon />}
          disabled={searching || endBeforeStart}
        >
          {searching ? "Searching…" : "Search"}
        </Button>
      </Actions>
    </FormCard>
  );
};
