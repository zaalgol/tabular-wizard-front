import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Grid } from '@mui/material';
import makeRequest from '../api'

const columns = [
  { field: 'id', headerName: 'Name' },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'created_at', headerName: 'Created At', width: 200 }
]

const getUserModels = async () => {
  try {
    const response = await makeRequest('/api/userModels/', 'GET', null, {}, true);
    if (response.status !== 200) {
      throw new Error('Server responded with an error!');
    }
    return response;
  } catch (error) {
    console.error("Failed to fetch AI models: ", error);
    return [];
  }
};

const UserModels = () => {
  const [tableData, setTableData] = useState([])
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserModels();
      const modelsArray = response.data.models;
      setTableData(modelsArray);
      console.log(tableData)
    };

    fetchData();
  }, []);  // added [] to avoid infinety rerendering

  console.log(tableData)

  return (
    <Grid container justifyContent="center" sx={{ mt: 16 }} >
      <Grid item xs={12} md={8} lg={6}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            initialState={{
              ...tableData.initialState,
              pagination: { paginationModel: { pageSize: pageSize, } },
            }}
            pageSizeOptions={[5, 10, 25]}
            rows={tableData}
            columns={columns}
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold', // Make the header font bold
              },
            }}
          />
        </div>
      </Grid>
    </Grid>
  )
}

export default UserModels