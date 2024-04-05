import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Dialog, DialogActions, DialogTitle, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../api';




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
  const [tableData, setTableData] = useState([]);
  const [pageSize] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserModels();
      const modelsArray = response.data.models;
      setTableData(modelsArray);
      console.log(tableData)
    };

    fetchData();
  }, []);  // added [] to avoid infinety rerendering

  const handleDelete = (id) => {
    setTableData(tableData.filter((item) => item.id !== id));
    setDeleteDialogOpen(false); // Close the dialog after deletion
  };

  const handleEditDescription = (id, newDescription) => {
    const updatedData = tableData.map((item) => {
      if (item.id === id) {
        return { ...item, description: newDescription };
      }
      return item;
    });
    setTableData(updatedData);
    setEditDialogOpen(false); // Close the edit dialog after saving
  };

  const openDeleteDialog = (model) => {
    setCurrentModel(model);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (model) => {
    setCurrentModel(model);
    setEditDialogOpen(true);
  };

  const columns = [
    { field: 'id', headerName: 'Name' },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => openEditDialog(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => openDeleteDialog(params.row)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/inference?model=${params.row.id}`)}>
            <PlayCircleOutlineIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Grid container justifyContent="center" sx={{ mt: 16 }}>
      <Grid item xs={12} md={8} lg={6}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            initialState={{
              pagination: { pageSize: pageSize },
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
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Description</DialogTitle>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={currentModel.description || ''}
          onChange={(e) => setCurrentModel({ ...currentModel, description: e.target.value })}
        />
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleEditDescription(currentModel.id, currentModel.description)}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this model?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleDelete(currentModel.id)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default UserModels;