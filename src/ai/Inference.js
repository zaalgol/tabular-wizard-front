import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { handleMakeRequest } from '../app/RequestNavigator';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
import { ModelNameInput, DescriptionInput, TargetColumnSelect, ModelTypeRadioGroup, TrainingStrategySelect, SamplingStrategySelect, UploadFile, MetricSelect, TitleView }
    from './ModelFormComponents';
import * as XLSX from 'xlsx';
import {
    Container, Grid, Select, MenuItem,
    FormControl, InputLabel, Box
} from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { LoadingButton } from '@mui/lab';
import { trainingStrategyOptions, samplingStrategyOptions, metricsRegressionOptions, metricsclassificationOptions } from './consts'
import { InfrenceIcon } from '../icons/InferenceIcon'


const getModelDetails = async (navigate, modelName) => {
    try {
        const response = await handleMakeRequest(navigate, `/api/model?model_name=${modelName}`, 'GET', null, {}, true);
        if (response.status !== 200) {
            throw new Error('Server responded with an error!');
        }
        return response;
    } catch (error) {
        console.error("Failed to fetch AI model: ", error);
        return [];
    }
};

const Inference = () => {
    const [searchParams] = useSearchParams();
    const modelName = searchParams.get('model');
    const navigate = useNavigate();

    const [state, setState] = useState({
        columns: [],
        data: [],
        datasetError: '',
        isLoading: false,
        isSubmitting: false,
        model: {},
        fileName: '',
        fileSize: 0,
    });

    const validateDataset = () => {
        if (state.data.length === 0) {
            setState(prev => ({ ...prev, datasetError: 'Please upload a dataset file.' }));
        } else {
            const { columns, target_column } = state.model;
            const dataColumns = state.data[0];

            // Filter out the target column from columns
            const requiredColumns = columns.filter(column => column !== target_column);

            // Check if all required columns are present in jsonData[0]
            const containsAllColumns = requiredColumns.every(column => dataColumns.includes(column));
            if (containsAllColumns) {
                setState(prev => ({ ...prev, datasetError: '' }));
            } else {
                setState(prev => ({ ...prev, datasetError: "Dataset doesn't contains all model columns" }));
            }

        }

    };


    useEffect(() => {
        const fetchData = async () => {
            validateDataset();
            // if (state.fileName === '') {
            //     setState(prev => ({ ...prev, columns: [], columnOptions: {} }));
            // } else {
            const response = await getModelDetails(navigate, modelName);
            const modelData = response.data.model;
            setState(prev => ({ ...prev, model: modelData }));
            // console.log(modelData);
            //}
        };

        fetchData();
    }, [state.datasetError, state.data, state.fileName]);

    function updateData(jsonData) {
        setState(prev => ({
            ...prev,
            columns: jsonData[0],
            data: jsonData,
            isLoading: false,
        }));
    }

    const handleRemoveFile = (fileInputRef) => {
        // Ensure that the function can be called with fileInputRef as a parameter
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setState(prev => ({ ...prev, fileName: '', fileSize: 0, data: [] }));
    };

    const handleSubmit = async () => {
        setState(prev => ({ ...prev, isSubmitting: true }));
        try {
            const inferenceDataMatrix = [];
            Object.keys(state.data).forEach(key => {
                inferenceDataMatrix.push(state.data[key]);
            });
            const payload = {
                dataset: state.data,
                modelName: modelName,
                fileName: state.fileName
            };

            const response = await handleMakeRequest(navigate, '/api/inference/', 'POST', payload, {}, true);
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting the data:', error);
        }
        setState(prev => ({ ...prev, isSubmitting: false }));
    };


    // Add custom styling here
    const containerStyles = {
        marginTop: '4px', // Adjust the top margin
        marginRight: '16px', // Adjust the right margin
    };

    const gridItemStyles = {
        padding: '8px', // Provides spacing inside each grid item
    };


    return (
        <Box sx={{ p: 1 }}>
            <Container maxWidth={false} sx={containerStyles}>
                <TitleView titleText="Inference" IconComponent={InfrenceIcon} />
                <Grid container spacing={3}>
                    <Grid item xs={2} sx={gridItemStyles}>
                        <DescriptionInput label="" value={modelName} />
                    </Grid>
                    <Grid item xs={4} sx={gridItemStyles}>
                        <DescriptionInput
                            readOnly={true}
                            value={state.model.description}
                            label=""
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <UploadFile loading={state.isLoading}
                            state={state}
                            updateData={updateData}
                            handleRemoveFile={handleRemoveFile}
                            setState={setState}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" sx={{ mt: 4 }}>
                            <Grid item xs={12} md={8} lg={6}>
                                <Paper elevation={3} sx={{ maxHeight: 230, overflow: 'auto', p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Model: {modelName}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        Target column: {state.model.target_column}
                                    </Typography>
                                    <List>
                                        {state.model.columns &&
                                            state.model.columns.map((column, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText primary={column} />
                                                </ListItem>
                                            ))}
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <DescriptionInput
                            label={""}
                            value={state.model.target_column}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={8} alignItems="center">
                            <Grid item>
                                <ModelTypeRadioGroup
                                    readOnly={true}
                                    value={state.model.model_type || ''}
                                    onChange={(event) =>
                                        setState((prev) => ({
                                            ...prev,
                                            model: {
                                                ...prev.model,
                                                model_type: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid>
                            {/* <Grid item>
                                <TrainingSpeedRadioGroup
                                    readOnly={true}
                                    value={state.model.training_speed || ''}
                                    onChange={(event) =>
                                        setState((prev) => ({
                                            ...prev,
                                            model: {
                                                ...prev.model,
                                                training_speed: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid>
                            <Grid item>
                                <ModelEnsembleRadioGroup
                                    readOnly={true}
                                    value={state.model.ensemble || ''}
                                    onChange={(event) =>
                                        setState((prev) => ({
                                            ...prev,
                                            model: {
                                                ...prev.model,
                                                ensemble: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid> */}
                            <Grid item xs={2}>
                                <TrainingStrategySelect
                                    readOnly={true}
                                    value={state.model.training_strategy || ''}
                                    trainingStrategies={trainingStrategyOptions}
                                    onChange={(event) =>
                                        setState((prev) => ({
                                            ...prev,
                                            model: {
                                                ...prev.model,
                                                trainingStrategy: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid>
                            {state.model.model_type === "classification" && <Grid item xs={2}>
                                <SamplingStrategySelect
                                    readOnly={true}
                                    value={state.model.sampling_strategy || ''}
                                    samplingStrategies={samplingStrategyOptions}
                                    onChange={(event) =>
                                        setState((prev) => ({
                                            ...prev,
                                            model: {
                                                ...prev.model,
                                                ensemble: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid>}
                            {state.model.model_type && <Grid item xs={2}>
                                <MetricSelect
                                    readOnly={true}
                                    metrics={state.model.model_type === "regression" ? metricsRegressionOptions : state.model.model_type === "classification" ? metricsclassificationOptions : {}}
                                    value={state.model.metric || ''}
                                    onChange={(event) =>
                                        setState((prev) => ({
                                            ...prev,
                                            model: {
                                                ...prev.model,
                                                metric: event.target.value,
                                            },
                                        }))
                                    }
                                />
                            </Grid>}
                        </Grid>
                    </Grid>
                    <Box sx={{ p: 1 }}>
                        <Container maxWidth={false} sx={containerStyles}>
                            {state.datasetError &&
                                // <div>{state.datasetError}</div>
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    <AlertTitle>Please fulfill these requirements!</AlertTitle>
                                    <div>{state.datasetError}</div>

                                </Alert>
                            }
                            <Grid container spacing={1}>
                                {/* ... */}
                            </Grid>
                        </Container>
                    </Box>
                    <Grid item xs={12}>
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!!state.datasetError}
                        >
                            Inference
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Inference