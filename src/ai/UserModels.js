import makeRequest from '../api'
import React, { useState, useEffect } from 'react';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';



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
  const [aiModels, setAiModels] = useState([]);

  useEffect(() => {
    console.log("rendering!!!!!")
    const fetchData = async () => {
      const response = await getUserModels();
      const modelsObject = response.data.models; // Assuming the structure you showed
      const modelsArray = Object.keys(modelsObject).map(key => ({
        ...modelsObject[key],
        name: key.replace(/_/g, ' ') // Replacing underscores with spaces
      }));
      setAiModels(modelsArray);
      console.log(aiModels)
    };

    fetchData();
  }, []);

  return (
    <Grid container justifyContent="center" sx={{ mt: 16 }}> {/* Added top margin here */}
      <Grid item xs={12} md={8} lg={6}>
        <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
          <Table stickyHeader sx={{ maxWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aiModels.map((model) => (
                <TableRow key={model.name}>
                  <TableCell component="th" scope="row">
                    {model.name}
                  </TableCell>
                  <TableCell>{model.description}</TableCell>
                  <TableCell>{model.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default UserModels;


