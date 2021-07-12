import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';


const styles = (theme) => ({
	flexContainer: {
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box'
	},
	table: {
		'& .ReactVirtualized__Table__headerRow': {
			flip: false,
			paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined
		}
	},
	tableRow: {
		cursor: 'pointer'
		
	},
	tableRowHover: {
		'&:hover': {
			backgroundColor: '#6e7076'
		}
	},
	tableCell: {
		flex: 1,
		color: 'white'
	},
	noClick: {
		cursor: 'initial'
	}
});

class MuiVirtualizedTable extends React.PureComponent {
	static defaultProps = {
		headerHeight: 48,
		rowHeight: 42
	};

	getRowClassName = ({ index }) => {
		const { classes, onRowClick } = this.props;

		return clsx(classes.tableRow, classes.flexContainer, {
			[classes.tableRowHover]: index !== -1 && onRowClick != null
		});
	};

	cellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, rowHeight, onRowClick } = this.props;
		return (
			<TableCell
				component='div'
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null
				})}
				variant='body'
				style={{ height: rowHeight }}
				align={
					(columnIndex != null && columns[columnIndex].numeric) || false
						? 'right'
						: 'left'
				}
			>
				{cellData}
			</TableCell>
		);
	};

	headerRenderer = ({ label, columnIndex }) => {
		const { headerHeight, columns, classes } = this.props;

		return (
			<TableCell
				component='div'
				className={clsx(
					classes.tableCell,
					classes.flexContainer,
					classes.noClick
				)}
				variant='head'
				style={{ height: headerHeight }}
				align={columns[columnIndex].numeric || false ? 'right' : 'left'}
			>
				<span>{label}</span>
			</TableCell>
		);
	};

	render() {
		const {
			classes,
			columns,
			rowHeight,
			headerHeight,
			...tableProps
		} = this.props;
		return (
			<AutoSizer>
				{({ height, width }) => (
					<Table
						height={height}
						width={width}
						rowHeight={rowHeight}
						gridStyle={{
							direction: 'inherit'
						}}
						headerHeight={headerHeight}
						className={classes.table}
						{...tableProps}
						rowClassName={this.getRowClassName}
					>
						{columns.map(({ dataKey, ...other }, index) => {
							return (
								<Column
									key={dataKey}
									headerRenderer={(headerProps) =>
										this.headerRenderer({
											...headerProps,
											columnIndex: index
										})
									}
									className={classes.flexContainer}
									cellRenderer={this.cellRenderer}
									dataKey={dataKey}
									{...other}
								/>
							);
						})}
					</Table>
				)}
			</AutoSizer>
		);
	}
}

MuiVirtualizedTable.propTypes = {
	classes: PropTypes.object.isRequired,
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			dataKey: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			numeric: PropTypes.bool,
			width: PropTypes.number.isRequired
		})
	).isRequired,
	headerHeight: PropTypes.number,
	onRowClick: PropTypes.func,
	rowHeight: PropTypes.number
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);


function createData(index, title) {
	return { index, title};
}


export default function TrackList(props) {
    const rowClick = (e) => {
        if (e && e.event && e.event.stopPropagation) {
            const track = props.albumTrack[e.rowData.index - 1]
            props.trackChange(track.artists, track.name, track.preview_url)
            e.event.stopPropagation();
        }
    }

    const rows = [];
    for (let i = 0; i < props.albumTrack.length; i += 1) {
        rows.push(createData(i + 1, props.albumTrack[i].name));
    }

    return (
		<Paper style={{
			    height: 300,
			    width: '400px',
                marginTop: '20px',
			    marginRight: 'auto',
                marginBottom: '50px',
			    marginLeft: 'auto',
			    boxShadow: '0px 0px',
				backgroundColor: '#282c34',
			}}>
			<VirtualizedTable
				rowCount={rows.length}
				rowGetter={({ index }) => rows[index]}
                onRowClick={rowClick}

				columns={[
					{
						width: 60,
						label: '#',
						dataKey: 'index'
					},
					{
						width: 400,
						label: 'タイトル',
						dataKey: 'title'
					}
				]}
			/>
		</Paper>
	);
}
