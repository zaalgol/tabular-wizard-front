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
import { trainingStrategyOptions, samplingStrategyOptions, metricsRegressionOptions, metricsclassificationOptions } from './consts';

const UserModels = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');
  const [pageSize] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleMakeRequest(navigate, '/api/userModels/', 'GET', null, {}, true);
        const modelsArray = response.data.models.map(model => ({
          ...model,
          training_strategy: trainingStrategyOptions[model.training_strategy],
          metric: {...metricsRegressionOptions, ...metricsclassificationOptions}[model.metric],
          sampling_strategy: samplingStrategyOptions[model.sampling_strategy],
          created_at: new Date(model.created_at),
        }));
        setTableData(modelsArray);
        setFilteredData(modelsArray);
      } catch (error) {
        console.error('Failed to fetch AI models: ', error);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (filter) {
      const lowercasedFilter = filter.toLowerCase();
      const filteredData = tableData.filter(item =>
        Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(lowercasedFilter)
        )
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(tableData);
    }
  }, [filter, tableData]);

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
    { field: 'id', headerName: 'Name', width: 270, headerAlign: 'center' },
    { field: 'description', headerName: 'Description', width: 110, headerAlign: 'center' },
    { field: 'created_at', headerName: 'Created At', width: 200, headerAlign: 'center' },
    { field: 'file_name', headerName: 'Train File Name', width: 180, headerAlign: 'center' },
    { field: 'file_line_num', headerName: 'Dataset Lines', width: 110, headerAlign: 'center' },
    { field: 'model_type', headerName: 'Model Type', width: 110, headerAlign: 'center' },
    { field: 'training_strategy', headerName: 'Training Strategy', width: 170, headerAlign: 'center' },
    { field: 'sampling_strategy', headerName: 'Sampling Strategy', width: 180, headerAlign: 'center' },
    { field: 'metric', headerName: 'Metric', width: 80, headerAlign: 'center' },
    { field: 'train_score', headerName: 'Train Score', width: 100, headerAlign: 'center' },
    { field: 'test_score', headerName: 'Test Score', width: 100, headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      headerAlign: 'center',
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
      headerClassName: 'action-column-header',
      cellClassName: 'action-column-cell',
    },
  ];

  return (
    <Grid container justifyContent="center" sx={{ mt: 3 }}>
      <Grid item xs={12} sx={{ mb: 3, display: 'flex', alignItems: 'center', pl: 4, pr: 4, justifyContent: 'space-between' }}>
        <TitleView titleText="User Models" IconComponent={ModelsGridIcon} />
        <TextField
          variant="outlined"
          placeholder="Filter models"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{ width: '300px' }}
        />
      </Grid>
      <Grid item xs={12} sx={{ width: '100%', pl: 4, pr: 4 }}>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            initialState={{
              pagination: { pageSize: pageSize },
            }}
            pageSizeOptions={[5, 10, 25]}
            rows={filteredData}
            columns={columns}
            sx={{
              '& .action-column-header': {
                borderLeft: '2px solid rgba(224, 224, 224, 1)',
              },
              '& .action-column-cell': {
                borderLeft: '2px solid rgba(224, 224, 224, 1)',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
                textAlign: 'center',
              },
              '& .MuiDataGrid-footerContainer': {
                display: 'none',
              },
              '& .MuiDataGrid-cell': {
                textAlign: 'center',
                borderRight: '1px solid rgba(224, 224, 224, 1)', // Add vertical lines between cells
              },
              '& .MuiDataGrid-columnHeader': {
                borderRight: '1px solid rgba(224, 224, 224, 1)', // Add vertical lines between column headers
              },
              '& .MuiDataGrid-columnHeader:last-child': {
                borderRight: 'none', // Remove the right border from the last column header
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
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
