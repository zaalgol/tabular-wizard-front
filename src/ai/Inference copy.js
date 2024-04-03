import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Grid } from '@mui/material';
import makeRequest from '../api'
import { useSearchParams } from 'react-router-dom';

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

const Inference_old = () => {
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
    
    return (
        <Grid container justifyContent="center" sx={{ mt: 16 }} >
            <Grid item xs={12} md={8} lg={6}>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        columns={setColumns(modelData['columns'])}
                    />
                </div>
            </Grid>
        </Grid>
    )
}

export default Inference_old