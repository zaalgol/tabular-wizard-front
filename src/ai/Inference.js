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
    const [modelState, setModelState] = useState({
        columns: []
    });
    const [inferenceData, setInferenceDataData] = useState({});
    const [pageStage, setPageStage] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await getModelDetails(modelName);
            const modelData = response.data.model;
            setModelState(prev => ({ ...prev, ...modelData }));
            console.log(modelData)
        };

        fetchData();
    }, []);  // added [] to avoid infinety rerendering

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) {
            setPageStage(prev => ({ ...prev, isLoading: true }));
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
                if (jsonData.length > 0) {
                    setInferenceDataData(prev => ({
                        ...prev,
                        ...jsonData,
                    }));
                    setPageStage(prev => ({
                        ...prev,
                        isLoading: false,
                    }));
                }
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                setPageStage(prev => ({ ...prev, isLoading: false }));
            };
            reader.readAsBinaryString(file);
        } else {
            console.error('No file selected');
        }
    };

    const handleSubmit = async () => {
        setPageStage(prev => ({ ...prev, isSubmitting: true }));
        try {
            // convert dict to matrix
            const inferenceDataMatrix = [];
            Object.keys(inferenceData).forEach(key => {
                inferenceDataMatrix.push(inferenceData[key]);
            });
            // Prepare the payload
            const payload = {
                dataset: inferenceDataMatrix,
                modelName: modelName,
            };

            // Send the data to the server
            const response = await makeRequest('/api/inference/', 'POST', payload, {}, true); // Adjust the endpoint as necessary
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error submitting the data:', error);
        }
        setPageStage(prev => ({ ...prev, isSubmitting: false }));
    };


    // Add custom styling here
    const containerStyles = {
        marginTop: '16px', // Adjust the top margin
        marginRight: '16px', // Adjust the right margin
    };

    const gridItemStyles = {
        padding: '8px', // Provides spacing inside each grid item
    };


    return (
        <Box sx={{ p: 4 }}> {/* Use Box to provide padding around the entire component */}
            <Container maxWidth={false} sx={containerStyles}>
                <TitleView titleText="Inference">
                </TitleView>
                <Grid container spacing={3}>
                    <Grid item xs={2} sx={gridItemStyles}>
                        <DescriptionInput
                            label=""
                            value={modelName}
                        />
                    </Grid>
                    <Grid item xs={4} sx={gridItemStyles}>
                        <DescriptionInput
                            // readOnly = {true}
                            value={modelState.description}
                            label=""
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <UploadFile
                            loading={modelState.isLoading}
                            onChange={handleFileChange}
                        >
                        </UploadFile>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" sx={{ mt: 5 }}>
                            <Grid item xs={12} md={8} lg={6}>
                                <Paper elevation={3} sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Model: {modelName}
                                    </Typography>
                                    <List>
                                        {modelState['columns'].map((column, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={column} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    {<Grid item xs={2}>
                        <DescriptionInput
                            label={""}
                            value={modelState.target_column}
                        />
                    </Grid>}
                    <Grid item xs={12}>
                        <Grid container spacing={8} alignItems="center">
                            <Grid item>
                                <ModelTypeRadioGroup
                                    readOnly={true}
                                    value={modelState.model_type || ''}
                                    onChange={(event) => setModelState({ ...modelState, model_type: event.target.value })}
                                />
                            </Grid>
                            <Grid item>
                                <TrainingSpeedRadioGroup
                                    readOnly={true}
                                    value={modelState.training_speed || ''}
                                    onChange={(event) => setModelState({ ...modelState, training_speed: event.target.value })}

                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Infrence
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Inference