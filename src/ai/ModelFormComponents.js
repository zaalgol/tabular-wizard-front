import React from 'react';
import {
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton, Select, MenuItem,
    FormControl, Radio, RadioGroup, InputLabel, FormControlLabel, Typography, TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab'
import * as XLSX from 'xlsx';
// View title
export const TitleView = ({ titleText }) => ([
    <Typography variant="h4" gutterBottom>
        {titleText}
    </Typography>
])


// Model Name Input
export const ModelNameInput = ({ value, onChange, readOnly = false }) => (
    <TextField
        required
        fullWidth
        name="modelName"
        label="Model Name"
        value={value}
        onChange={onChange}
        InputProps={{ readOnly }}
    />
);

// Description Input
export const DescriptionInput = ({ value, onChange, label = '', readOnly = false }) => (
    <TextField
        required
        fullWidth
        name="description"
        label={label}
        value={value}
        onChange={onChange}
        InputProps={{ readOnly }}
    />
);

// Target Column Select
export const TargetColumnSelect = ({ columns, value, onChange, readOnly = false }) => (
    <FormControl fullWidth>
        <InputLabel id="target-column-label">Target Column</InputLabel>
        <Select
            name="targetColumn"
            labelId="target-column-label"
            id="target-column-select"
            value={value}
            label="Target Column"
            onChange={onChange}
            readOnly={readOnly}
        >
            {columns.map((col, index) => (
                <MenuItem key={index} value={col}>{col}</MenuItem>
            ))}
        </Select>
    </FormControl>
);

// Model Type Radio Group
export const ModelTypeRadioGroup = ({ value, onChange, readOnly = false }) => (
    <FormControl component="fieldset">
        <RadioGroup row aria-label="model-type" name="modelType" value={value} onChange={onChange}>
            <FormControlLabel value="regression" control={<Radio />} label="Regression" disabled={readOnly} />
            <FormControlLabel value="classification" control={<Radio />} label="Classification" disabled={readOnly} />
        </RadioGroup>
    </FormControl>
);

// Training Speed Radio Group
export const TrainingSpeedRadioGroup = ({ value, onChange, readOnly = false }) => (
    <FormControl component="fieldset">
        <RadioGroup row aria-label="training-speed" name="trainingSpeed" value={value} onChange={onChange}>
            <FormControlLabel value="fast" control={<Radio />} label="Fast Training" disabled={readOnly} />
            <FormControlLabel value="slow" control={<Radio />} label="Slow Training But More Accurate" disabled={readOnly} />
        </RadioGroup>
    </FormControl>
);

export const UploadFile = ({ state, updateData, setState, loading, handleRemoveFile }) => {
    const fileInputRef = React.createRef();

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            setState(prev => ({ ...prev, isLoading: true }));
            setState(prev => ({ ...prev, fileName: file.name, fileSize: file.size }));

            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }).map(row =>
                    row.map(cell => typeof cell === 'string' ? cell.trim() : cell)
                );
                if (jsonData.length > 0) {
                    updateData(jsonData);
                }
                setState(prev => ({ ...prev, isLoading: false }));
            };
            reader.onerror = () => {
                console.error('Error reading file');
                setState(prev => ({ ...prev, isLoading: false }));
            };
            reader.readAsBinaryString(file);
        }
    };

    return (
        <div>
            <LoadingButton
                variant="contained"
                component="label"
                loading={loading}
            >
                Upload File
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                />
            </LoadingButton>
            {state.fileName && (
                <div style={{ marginTop: 5, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1">
                        File selected: {state.fileName}
                    </Typography>
                    <IconButton onClick={() => handleRemoveFile(fileInputRef)} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export const DatasetContent = ({ state, renderColumnOptions, handleChangePage, handleChangeRowsPerPage }) => (
    <TableContainer component={Paper} sx={{ maxHeight: 327, overflow: 'auto' }}>
        <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                    {state.columns.map((col, index) => (
                        <TableCell key={index}>
                            <Typography variant="h6">{col}</Typography>
                            {renderColumnOptions(index)}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {state.data
                    .slice(1)
                    .slice((state.currentPage - 1) * state.rowsPerPage, state.currentPage * state.rowsPerPage)
                    .map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
        {state.data.length > 0 && <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={state.data.length}
            rowsPerPage={state.rowsPerPage}
            page={state.currentPage - 1} // Subtract 1 for zero-indexed page prop
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage} />}
    </TableContainer>
)
