'use client'

import React, { useMemo } from 'react'
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table'

interface Props {
  enableRowSelection?: boolean
  enableBottomToolbar?: boolean
}

const MockTableData = ({
  enableRowSelection = false,
  enableBottomToolbar = true,
}: Props) => {
  const data = [
    {
      title: '신규 이벤트 안내',
      dispatchDate: '2025-01-20 15:30',
      detail: '새로운 이벤트가 시작되었습니다. 지금 확인해보세요!',
      transmissionType: '전체발송',
      targetSending: '150명',
    },
    {
      title: '회원 전용 혜택',
      dispatchDate: '2025-01-19 11:20',
      detail: '특별 회원 혜택이 도착했습니다.',
      transmissionType: '선택발송',
      targetSending: '50명',
    },
  ]

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'dispatchDate',
        header: '발송일시',
        size: 60,
      },
      {
        accessorKey: 'title',
        header: '제목',
        size: 40,
      },
      {
        accessorKey: 'detail',
        header: '내용',
        size: 100,
      },
      {
        accessorKey: 'transmissionType',
        header: '발송타입',
        size: 40,
      },
      {
        accessorKey: 'targetSending',
        header: '발송대상',
        size: 40,
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnActions: false,
    enableSorting: false,
    enableTopToolbar: false,
    manualPagination: true,
    muiTableHeadCellProps: {
      sx: {
        background: '#F9FAFB',
        borderBottom: '0px',
      },
    },
    muiTablePaperProps: {
      sx: { border: 0 },
    },
    muiPaginationProps: {
      sx: { border: 0 },
    },
    enableRowSelection,
    enableBottomToolbar,
  })
  return (
    <div className="custom-table max-w-full rounded-lg pb-4">
      <MaterialReactTable table={table} />
    </div>
  )
}

export default MockTableData
