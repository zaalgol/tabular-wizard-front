import React from 'react';
import {
    Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton, Select, MenuItem,
    FormControl, Radio, RadioGroup, InputLabel, FormControlLabel, Typography, TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab'
import ExcelJS from 'exceljs';
import Papa from 'papaparse';
import './ModelFormComponents.css';


// View title
export const TitleView = ({ titleText, IconComponent }) => (
    <div className="title-container">
        {IconComponent && <div className="title-icon"> <IconComponent  /></div>}
        <Typography variant="h5" gutterBottom className="title">
            {titleText}
        </Typography>
    </div>
);


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
        className={readOnly ? 'read-only-field' : ''}

    />
);

// Description Input
export const DescriptionInput = ({ value, onChange, label = '', readOnly = false }) => (
    <TextField
        fullWidth
        name="description"
        label={label}
        value={value}
        onChange={onChange}
        InputProps={{ readOnly }}
        className={readOnly ? 'read-only-field' : ''}
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
            className={readOnly ? 'read-only-field' : ''}
        >
            {columns.map((col, index) => (
                <MenuItem key={index} value={col}>{col}</MenuItem>
            ))}
        </Select>
    </FormControl>
);

// Metric Select
export const MetricSelect = ({ metrics, value, onChange, readOnly = false }) => (
    <FormControl fullWidth>
        <InputLabel id="target-column-label">Metric</InputLabel>
        <Select
            name="metric"
            labelId="metric-select-label"
            id="metric-select"
            value={value}
            label="Metric"
            onChange={onChange}
            readOnly={readOnly}
            className={readOnly ? 'read-only-field' : ''}
        >
            {Object.keys(metrics).map((key) => (
                <MenuItem key={key} value={key}>{metrics[key]}</MenuItem>
            ))}
        </Select>
    </FormControl>
);

// Training Strateg Select
export const TrainingStrategySelect = ({ trainingStrategies, value, onChange, readOnly = false }) => (
    <FormControl fullWidth>
        <InputLabel id="training-strategy-label">Training Strategy</InputLabel>
        <Select
            name="trainingStrategy"
            labelId="training-strategy-label"
            id="training-strategy-select"
            value={value}
            label="Training Strategy"
            onChange={onChange}
            readOnly={readOnly}
            className={readOnly ? 'read-only-field' : ''}
        >
            {Object.keys(trainingStrategies).map((key) => (
                <MenuItem key={key} value={key}>{trainingStrategies[key]}</MenuItem>
            ))}
        </Select>
    </FormControl>
);

// Sampling Strateg Select
export const SamplingStrategySelect = ({ samplingStrategies, value, onChange, readOnly = false }) => (
    <FormControl fullWidth>
        <InputLabel id="sampling-strategy-label">Sampling Strategy</InputLabel>
        <Select
            name="samplingStrategy"
            labelId="sampling-strategy-label"
            id="sampling-strategy-select"
            value={value}
            label="Sampling Strategy"
            onChange={onChange}
            readOnly={readOnly}
            className={readOnly ? 'read-only-field' : ''}
        >
            {Object.keys(samplingStrategies).map((key) => (
                <MenuItem key={key} value={key}>{samplingStrategies[key]}</MenuItem>
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

// Model Ensemble Radio Group
export const ModelEnsembleRadioGroup = ({ value, onChange, readOnly = false }) => (
    <FormControl component="fieldset">
        <RadioGroup row aria-label="model-ensemble" name="modelEnsemble" value={value} onChange={onChange}>
            <FormControlLabel value="single" control={<Radio />} label="Single Model" disabled={readOnly} />
            <FormControlLabel value="multi" control={<Radio />} label="Multi Models" disabled={readOnly} />
        </RadioGroup>
    </FormControl>
);

export const UploadFile = ({ state, updateData, setState, loading, handleRemoveFile }) => {
    const fileInputRef = React.createRef();

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            setState(prev => ({ ...prev, isLoading: true }));
            setState(prev => ({ ...prev, fileName: file.name, fileSize: file.size, targetColumn: '' }));

            if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                const reader = new FileReader();
                reader.onload = async (evt) => {
                    const arrayBuffer = evt.target.result;
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(arrayBuffer);
                    const worksheet = workbook.worksheets[0];

                    const jsonData = [];
                    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                        const rowData = [];
                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            if (cell.type === ExcelJS.ValueType.Date) {
                                rowData.push(`${cell.value.getFullYear()}-${('0' + (cell.value.getMonth() + 1)).slice(-2)}-${('0' + cell.value.getDate()).slice(-2)}`);
                            } else if (typeof cell.value === 'string') {
                                rowData.push(cell.value.trim());
                            } else {
                                rowData.push(cell.value);
                            }
                        });
                        jsonData.push(rowData);
                    });

                    if (jsonData.length > 0) {
                        const headers = jsonData[0];
                        const validIndexes = headers.map((header, index) => header ? index : null).filter(index => index != null);
                        const filteredData = jsonData.map(row =>
                            row.filter((_, index) => validIndexes.includes(index))
                        );

                        updateData(filteredData);
                    }

                    setState(prev => ({ ...prev, isLoading: false }));
                };
                reader.onerror = () => {
                    console.error('Error reading file');
                    setState(prev => ({ ...prev, isLoading: false }));
                };
                reader.readAsArrayBuffer(file);
            } else if (file.type === "text/csv") {
                Papa.parse(file, {
                    complete: (result) => {
                        const jsonData = result.data.map(row =>
                            row.map(cell => {
                                // Check if the cell is a valid number and return as a number
                                if (!isNaN(cell) && cell.trim() !== '') {
                                    return Number(cell);
                                }
                                if (typeof cell === 'string') {
                                    return cell.trim();
                                } else {
                                    return cell;
                                }
                            })
                        );

                        // Filter out empty rows
                        const filteredJsonData = jsonData.filter(row => row.some(cell => cell !== ''));

                        if (filteredJsonData.length > 0) {
                            const headers = filteredJsonData[0];
                            const validIndexes = headers.map((header, index) => header ? index : null).filter(index => index != null);
                            const filteredData = filteredJsonData.map(row =>
                                row.filter((_, index) => validIndexes.includes(index))
                            );

                            updateData(filteredData);
                        }

                        setState(prev => ({ ...prev, isLoading: false }));
                    },
                    error: (error) => {
                        console.error('Error parsing CSV file', error);
                        setState(prev => ({ ...prev, isLoading: false }));
                    }
                });
            } else {
                console.error('Unsupported file type');
                setState(prev => ({ ...prev, isLoading: false }));
            }
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
                <TableRow sx={{ borderTop: '2px solid rgba(224, 224, 224, 1)' }}>
                    {state.columns.map((col, index) => (
                        <TableCell
                            key={index}
                            sx={{ 
                                borderRight: index < state.columns.length - 1 ? '1px solid rgba(224, 224, 224, 1)' : 'none',
                                borderTop: '2px solid rgba(224, 224, 224, 1)' // Add a thicker top border for visibility
                            }}
                        >
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
                                <TableCell
                                    key={cellIndex}
                                    sx={{ 
                                        borderRight: cellIndex < row.length - 1 ? '1px solid rgba(224, 224, 224, 1)' : 'none' 
                                    }}
                                >
                                    {cell}
                                </TableCell>
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


