import { Row, SortingState, createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { PingInfo_IP, PingInfo } from '@core'
import { useEffect, useRef, useState } from 'react'
import { useVirtual } from '@tanstack/react-virtual'
import React from 'react'
import './Application.scss'

const FIX = 0

interface Props {
    data: PingInfo
}

const Application: React.FC<Props> = (props) => {
    const [data, setData] = useState<PingInfo_IP[]>(props.data.ip_infos)

    useEffect(() => {
        window.api.handle('mainwin:get-data', (event: any, data: PingInfo) => {
            console.log(`got ${data.ip_infos.length} data!`)
            console.log(data.ip_infos)
            setData(data.ip_infos)
        })
    }, [])

    const [sorting, setSorting] = useState<SortingState>([]);

    const columnHelper = createColumnHelper<PingInfo_IP>()
    const columns = [
        columnHelper.accessor('hostname', {
            header: () => 'Host',
        }),
        columnHelper.accessor('ip', {
            header: () => 'IP'
        }),
        columnHelper.accessor('description', {
            header: () => 'Description',
        }),
        columnHelper.accessor('failed_ratio', {
            header: () => 'Failed %',
            cell: props => (props.getValue() * 100)?.toFixed(FIX)
        }),
        columnHelper.accessor('total_sent_count', {
            header: () => 'Total Sent #'
        }),
        columnHelper.accessor('failed_count', {
            header: () => 'Failed #'
        }),
        columnHelper.accessor('average_ping_ms', {
            header: () => 'Average ms',
            cell: props => props.getValue()?.toFixed(0)
        }),
        columnHelper.accessor('maximum_ping_ms', {
            header: () => 'Max ms'
        }),
        columnHelper.accessor('minimum_ping_ms', {
            header: () => 'Min ms'
        }),
        columnHelper.accessor('last_ping_ms', {
            header: () => 'Last ms'
        }),
        columnHelper.accessor('max_consecutive_failed_count', {
            header: () => 'Max Consecutive Failed #'
        }),
        columnHelper.accessor('max_consecutive_failed_ms', {
            header: () => 'Max Consecutive Failed ms',
            // cell: props => (new Date(props.getValue()))?.toISOString().slice(11, -1)
        }),
        columnHelper.accessor('consecutive_failed_count', {
            header: () => 'Consecutive Failed #'
        }),
        columnHelper.accessor('last_failed_on', {
            header: () => 'Last Failed on',
            cell: props => props.getValue()?.toLocaleString()
        }),
        columnHelper.accessor('last_ping_status', {
            header: () => 'Last Status',
            cell: props => props.getValue()
        }),
        columnHelper.accessor('last_succeed_on', {
            header: () => 'Last Succeed on',
            cell: props => props.getValue()?.toLocaleString()
        }),
        columnHelper.accessor('succeed_ratio', {
            header: () => 'Succeed %',
            cell: props => (props.getValue() * 100)?.toFixed(FIX)
        }),
        columnHelper.accessor('succeed_count', {
            header: () => 'Succeed #'
        }),
    ]

    const table = useReactTable<PingInfo_IP>({
        data: data,
        columns: columns,
        state: {
            sorting: sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true
    })

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const { rows } = table.getRowModel();
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 20
    });
    const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    const paddingBottom = virtualRows.length > 0
        ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
        : 0;
    return (
        <>
            <div ref={tableContainerRef} className='container'>
                <table>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th key={header.id}
                                            colSpan={header.colSpan}
                                            style={{ width: header.getSize() }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {/* {paddingTop > 0 && (
                            <tr>
                                <td style={{ height: `${paddingTop}px` }}></td>
                            </tr>
                        )} */}
                        {/* {virtualRows.map(virtualRows => {
                            const row = rows[virtualRows.index] as Row<PingInfo_IP>
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })} */}
                        {
                            rows.map(row => {
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )

                            })
                        }
                        {/* {paddingBottom > 0 && (
                            <tr>
                                <td style={{ height: `${paddingBottom}px` }}></td>
                            </tr>
                        )} */}
                    </tbody>
                </table>
            </div >
        </>
    )
}

export default Application