import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import makeRequest from '../api'
import { useSearchParams } from 'react-router-dom';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
import { ModelNameInput, DescriptionInput, TargetColumnSelect, ModelTypeRadioGroup, TrainingSpeedRadioGroup, UploadFile, DatasetContent, TitleView }
    from './ModelFormComponents';
import * as XLSX from 'xlsx';
import {
    Container, Grid, Select, MenuItem,
    FormControl, InputLabel, Box
} from '@mui/material';
import { LoadingButton } from '@mui/lab';


const getModelDetails = async (modelName) => {
    try {
        const response = await makeRequest(`/api/model?model_name=${modelName}`, 'GET', null, {}, true);
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
            setState(prev => ({ ...prev, datasetError: '' }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            validateDataset();
            const response = await getModelDetails(modelName);
            const modelData = response.data.model;
            setState(prev => ({ ...prev, model: modelData }));
            console.log(modelData);
        };

        fetchData();
    }, [state.datasetError, state.data]);

    function updateData(jsonData) {
        setState(prev => ({
            ...prev,
            columns: jsonData[0],
            data: jsonData,
            isLoading: false,
        }));
    }

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

            const response = await makeRequest('/api/inference/', 'POST', payload, {}, true);
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
                <TitleView titleText="Inference"></TitleView>
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
                            setState={setState}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" sx={{ mt: 5 }}>
                            <Grid item xs={12} md={8} lg={6}>
                                <Paper elevation={3} sx={{ maxHeight: 255, overflow: 'auto', p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Model: {modelName}
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
                            <Grid item>
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
                        </Grid>
                    </Grid>
                    <Box sx={{ p: 1 }}>
                        <Container maxWidth={false} sx={containerStyles}>
                            {state.datasetError && <div>{state.datasetError}</div>}
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
                            disabled={state.datasetError}
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