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

const setColumns = (modelDataColumns) => {
    return modelDataColumns.map(column => {
        return { field: column, headerName: column }
    })
}

const Inference = () => {
    const [searchParams] = useSearchParams();
    const modelName = searchParams.get('model');
    const [modelData, setState] = useState({
        columns: []

    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await getModelDetails(modelName);
            const modelData = response.data.model;
            setState(modelData);
            console.log(modelData)
        };

        fetchData();
    }, []);  // added [] to avoid infinety rerendering

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
                            value={modelData.description}
                            label=""
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <UploadFile
                            loading={modelData.isLoading}
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
                                        {modelData['columns'].map((column, index) => (
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
                            value={modelData.target_column}
                        />
                    </Grid>}
                    <Grid item xs={12}>
                        <Grid container spacing={8} alignItems="center">
                            <Grid item>
                                <ModelTypeRadioGroup
                                    value={modelData.modelType}
                                />
                            </Grid>
                            <Grid item>
                                <TrainingSpeedRadioGroup
                                    value={modelData.trainingSpeed}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            // loading={modelData.isSubmitting}
                        >
                            Infrence
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );

    return (
        <Grid container justifyContent="center" sx={{ mt: 16 }}>
            <Grid item xs={12} md={8} lg={6}>
                <Paper elevation={3} sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Model: {modelName}
                    </Typography>
                    <List>
                        {modelData['columns'].map((column, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={column} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Inference