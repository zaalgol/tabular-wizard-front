import React, { useState } from 'react';
import {
    Grid, Select, MenuItem, FormControl, Tooltip, Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';

const CustomColumnHeader = ({ column }) => {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
        // You can perform additional actions here based on the selection
    };

    return (
        <div style={{   display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingTop: '4px', // Corrected padding
        paddingBottom: '4px' // Corrected padding 
    }}>
            <Tooltip title={column.headerName} enterDelay={300}>
                <Typography variant="subtitle1" noWrap>
                    {column.headerName}
                </Typography>
            </Tooltip>
            <FormControl size="small" style={{ marginTop: '8px' }}>
                <Select
                    value={value || 'raw'}
                    onChange={handleChange}
                    displayEmpty
                    size="small"
                    style={{ fontSize: '0.8rem' }}
                >
                    {/* <MenuItem value="" disabled>Options</MenuItem> */}
                    <MenuItem value={'raw'}>Use column data</MenuItem>
                    {/* TODU: Add encryption logic*/}
                    {/* <MenuItem value={'data_encrypt'}>Encrypt column data</MenuItem>
        <MenuItem value={'column_name_encrypt'}>Encrypt column name</MenuItem>
        <MenuItem value={'data_and_column_name_encrypt'}>Encrypt column name and data</MenuItem> */}
                    <MenuItem value={'ignore'}>Don't use column data</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

const mapColumnsInGrid = (columns) => {
    return columns.map((column) => {
        return {
            field: column,
            headerName: column,
            minWidth: 250, // Minimum width for each column
            flex: 1, // Allow columns to grow to fill available space
            renderHeader: (params) => <CustomColumnHeader column={params.colDef} />
        };
    });
};

const convertMatrixToDictArray = (matrix) => {
    // Extract the headers from the first row
    const headers = matrix[0];
    // Map each row to an object, starting from the second row
    return matrix.slice(1).map(row => {
        // Reduce the current row into an object, where each header is a key
        return row.reduce((accumulator, currentValue, currentIndex) => {
            accumulator[headers[currentIndex]] = currentValue;
            return accumulator;
        }, {});
    });
}

export const DatasetGrid = ({ state }) => {
    const [pageSize] = useState(5);
    return <Grid container spacing={2}>
        <Grid item xs={12}>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid getRowId={(row) => uuidv4()}
                    initialState={{
                        pagination: { paginationModel: { pageSize: pageSize } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    rows={convertMatrixToDictArray(state.data)}
                    columns={mapColumnsInGrid(state.columns)}
                    columnHeaderHeight={86} // Set the header height to a larger value if needed
                    rowHeight={46} // Make sure the row height can accommodate content
                    sx={{
                        '& .MuiDataGrid-root': {
                            width: '100%',
                        },
                        '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                            lineHeight: 'normal',
                            display: 'flex', // Use flexbox for alignment
                            alignItems: 'center', // Center-align vertically
                            justifyContent: 'center', // Center-align horizontally
                            textAlign: 'center', // Center-align text
                            borderRight: '1px solid rgba(224, 224, 224, 1)', // Vertical lines
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            padding: '0', // Remove padding to align with cell border
                            backgroundColor: 'white',
                        },
                        '& .MuiDataGrid-columnHeaderTitleContainer': {
                            justifyContent: 'center', // Center-align the header content
                        },
                        '& .MuiDataGrid-iconSeparator': {
                            display: 'none', // Hide the icon separator in the header
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                            overflow: 'visible', // Allow the title to take up more space if needed
                            whiteSpace: 'normal', // Allow wrapping
                        },
                        '& .MuiDataGrid-columnHeaderSortable': {
                            // Increase padding to account for the space the sort icon would take
                            paddingRight: theme => theme.spacing(2),
                        },
                    }}
                />
            </div>
        </Grid>
    </Grid>
};