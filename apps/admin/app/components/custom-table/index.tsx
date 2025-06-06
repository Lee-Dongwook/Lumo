import { MaterialReactTable, MRT_TableInstance } from 'material-react-table'
import React from 'react'

const CustomTable = <T extends {}>({
  table,
  className,
  ...props
}: {
  table: MRT_TableInstance<T>
  className?: string
  [key: string]: any
}) => {
  return (
    <div className={`custom-table ${className}`}>
      <MaterialReactTable table={table} {...props} />
    </div>
  )
}

export default CustomTable
