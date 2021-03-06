import React from 'react';

import { withRouter } from 'react-router';
import { storiesOf } from '@storybook/react';
import makeSearchDataList from '@e-group/hooks/makeSearchDataList';

import StoryRouter from 'storybook-react-router';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import SearchDataList from '@e-group/material-module/SearchDataList';

const useSearchDataList = makeSearchDataList({
  fromKey: 'skip',
  sizeKey: 'take',
  queryKey: 'keyword',
});

const data = [
  { id: '1', name: 'name1' },
  { id: '2', name: 'name2' },
];

storiesOf('makeSearchDataList', module)
  .addDecorator(StoryRouter())
  .add('default', () => {
    const Demo = withRouter(() => {
      const [text, setText] = React.useState('');
      const {
        handleSearchChange,
        handleSearchSubmit,
        handleChangePage,
        handleChangeRowsPerPage,
        setPayload,
        payload,
      } = useSearchDataList({
        fetchGet: React.useCallback((payload) => {
          setText((val) => (val += 'dispatch action ! <br/>'));
        }, []),
      });

      const handleInputChange = (e) => {
        const { value } = e.target;
        setPayload((val) => ({
          ...val,
          input: value,
        }));
      };

      const handleCheckBoxChange = (name) => (e) => {
        setPayload((value) => ({
          ...value,
          [name]: e.target.checked ? 1 : 0,
        }));
      };

      const renderColumns = (rowData, index) => {
        return <ListItem key={index}>{rowData[0]}</ListItem>;
      };

      const renderDataRow = (el) => {
        return <ListItem key={el.id}>{el.name}</ListItem>;
      };

      return (
        <>
          <h1 dangerouslySetInnerHTML={{ __html: text }} />
          <div>{JSON.stringify(payload, null, 4)}</div>

          <SearchDataList
            onSubmit={handleSearchSubmit}
            title="??????"
            SearchBarProps={{
              placeholder: '??????',
              onChange: handleSearchChange,
              defaultValue: payload.query,
              renderOptions: ({ handleDropDownClose }) => (
                <Paper>
                  <Box p={3}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={4}>
                        <Typography color="textSecondary">
                          ??????????????????
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Checkbox
                          label="??????"
                          checked={Boolean(payload.status)}
                          onChange={handleCheckBoxChange('status')}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box p={3} pt={0} textAlign="right">
                    <Button
                      type="submit"
                      onClick={() => {
                        handleDropDownClose();
                      }}
                    >
                      ??????
                    </Button>
                  </Box>
                </Paper>
              ),
            }}
            toolsbar={
              <TextField
                placeholder="customized search value"
                onChange={handleInputChange}
                fullWidth
              />
            }
            columns={['??????']}
            data={data}
            renderColumns={renderColumns}
            renderDataRow={renderDataRow}
            disablePadding
            MuiTablePaginationProps={{
              count: 100,
              labelRowsPerPage: '????????????',
              page: Math.ceil(payload.skip / payload.take),
              rowsPerPage: parseInt(payload.take),
              onChangePage: handleChangePage,
              onChangeRowsPerPage: handleChangeRowsPerPage,
            }}
          />
        </>
      );
    });

    return <Demo />;
  });
