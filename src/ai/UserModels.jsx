import React, { useState, useEffect } from 'react';
import {
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { handleMakeRequest } from '../app/RequestNavigator';
import { ModelsGridIcon } from '../icons/ModelsGridIcon';

import { TitleView } from './ModelFormComponents';

const UserModels = () => {
  const [tableData, setTableData] = useState([]);
  const [pageSize] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleMakeRequest(navigate, '/api/userModels/', 'GET', null, {}, true);
        const modelsArray = response.data.models;
        setTableData(modelsArray);
      } catch (error) {
        console.error('Failed to fetch AI models: ', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    setTableData(tableData.filter((item) => item.id !== id));
    setDeleteDialogOpen(false);
    await handleMakeRequest(navigate, `/api/model?model_name=${id}`, 'DELETE', null, {}, true);
  };

  const handleEditDescription = (id, newDescription) => {
    const updatedData = tableData.map((item) => {
      if (item.id === id) {
        return { ...item, description: newDescription };
      }
      return item;
    });
    setTableData(updatedData);
    setEditDialogOpen(false);
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
    { field: 'id', headerName: 'Name', width: 300 },
    { field: 'description', headerName: 'Description', width: 400 },
    { field: 'created_at', headerName: 'Created At', width: 280 },
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
          <IconButton
            onClick={async () => {
              await handleMakeRequest(navigate, `/api/modelMetric?model_name=${params.row.id}`, 'GET', null, {}, true);
            }}
          >
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={() => navigate(`/inference?model=${params.row.id}`)}>
            <PlayCircleOutlineIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Grid container justifyContent="center" sx={{ mt: 10 }}>
      <Grid item xs={12} md={8} lg={10} sx={{ mb: 3 }}>
        <TitleView titleText="User Models" IconComponent={ModelsGridIcon} />
      </Grid>
      <Grid item xs={12} md={10} lg={10} sx={{ width: '100%', pl: 3, pr: 3 }}>
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
                fontWeight: 'bold',
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
