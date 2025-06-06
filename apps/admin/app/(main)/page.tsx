'use client'
import { SearchIcon } from '@/components/icons'
import { MRT_ColumnDef, useMaterialReactTable } from 'material-react-table'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { UserElement } from '@/store/interface/users'
import { useRouter, useSearchParams } from 'next/navigation'
import CustomTable from '@/components/custom-table'
import { useI18n } from 'app/provider/i18n/i18n-provider'
import { createClient } from '@/utils/supabase/client'
import { tableConfig } from '@/store/commonConfig'

const UserAvatar = ({ uuid, avatarPath }: any) => {
  const { data: hasValidAvatar } = useQuery({
    queryKey: ['avatar-exists', uuid],
    queryFn: async () => {
      try {
        const response = await fetch(`${avatarPath}/${uuid}.png`, {
          method: 'HEAD',
        })
        return response.ok
      } catch {
        return false
      }
    },
    staleTime: Infinity,
    retry: false,
  })

  const imageSrc =
    hasValidAvatar === false
      ? '/avatars/default.svg'
      : `${avatarPath}/${uuid}.png`

  return (
    <Image
      src={imageSrc}
      alt="avatar"
      width={24}
      height={24}
      className="h-6 w-6 rounded-full object-cover"
      onError={() => {}}
    />
  )
}

export default function Home() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [firstVisit] = useState(true)

  const [query, setQuery] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: Number(searchParams.get('page') || 0),
    pageSize: Number(searchParams.get('size') || 10),
  })
  const supabase = createClient()

  const avatarPath = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_STORAGE_URL
  const getData = async () => {
    const { data, count }: any = await supabase
      .from('user')
      .select('*', { count: 'exact' })
      .order('id')
      .range(
        pagination.pageIndex * 10,
        pagination.pageIndex * 10 + (pagination.pageSize - 1),
      )
    return { data, count }
  }

  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('firstVisit')

    if (!isFirstVisit && firstVisit) {
      sessionStorage.setItem('firstVisit', 'true')
      window.history.pushState({ customNav: true }, '', '/crm')
      window.history.pushState({ customNav: true }, '', '/event-management')
      window.history.pushState({ customNav: true }, '', '/')
    }
  }, [])

  const updatePagination = (
    updaterOrValue:
      | { pageIndex: number; pageSize: number }
      | ((prev: { pageIndex: number; pageSize: number }) => {
          pageIndex: number
          pageSize: number
        }),
  ) => {
    const newPagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(pagination)
        : updaterOrValue
    setPagination(newPagination)

    const params = new URLSearchParams()
    params.set('page', newPagination.pageIndex.toString())
    params.set('size', newPagination.pageSize.toString())

    window.history.pushState({}, '', `?${params.toString()}`)
  }

  const { data: usersList, isLoading } = useQuery({
    queryKey: ['users', pagination.pageIndex, pagination.pageSize],
    queryFn: () => getData(),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  })
  const columns = useMemo<MRT_ColumnDef<UserElement>[]>(
    () => [
      {
        accessorKey: 'email',
        header: '이메일',
        size: 70,
        accessorFn: (row) => (
          <div className="flex items-center gap-2">
            <UserAvatar uuid={row.uuid} avatarPath={avatarPath} />
            {row.email}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: '이름',
        size: 50,
      },
      {
        accessorKey: 'nickname',
        header: '닉네임',
        size: 50,
      },
      {
        accessorKey: 'birthDate',
        header: '생년월일',
        size: 50,
      },
      {
        accessorKey: 'country',
        header: '국적',
        size: 50,
      },
      {
        accessorKey: 'gender',
        header: '성별',
        size: 50,
        accessorFn: (row) => (
          <div>
            {row.gender && t(`admin.gender.${row.gender?.toLowerCase()}`)}
          </div>
        ),
      },
      {
        accessorKey: 'auth_provider',
        header: '소셜로그인',
        size: 50,
        accessorFn: (row) => (
          <div>{t(`admin.social.${row.auth_provider.toLowerCase()}`)}</div>
        ),
      },
      {
        accessorKey: 'role',
        header: '관리',
        size: 50,
      },
    ],
    [],
  )

  const handleRowClick = (uuid: string) => {
    router.push(
      `/user-management/${uuid}?returnPage=${pagination.pageIndex}&returnSize=${pagination.pageSize}`,
    )
  }

  const table = useMaterialReactTable({
    columns,
    data: usersList?.data || [],
    rowCount: usersList?.count,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => handleRowClick(row.original.uuid),
      sx: { cursor: 'pointer' },
    }),
    state: {
      isLoading: isLoading,
      pagination,
    },
    onPaginationChange: updatePagination,
    paginationDisplayMode: 'pages',
    ...tableConfig,
  })

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
  }

  return (
    <div className="h-full w-full rounded-lg bg-white">
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold">회원 관리</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="min-w-67 h-10 rounded-lg border border-[#E5E7EB] pl-4 text-base font-normal placeholder:text-[#ADAEBC] focus:outline-none"
            placeholder="회원 검색"
            onChange={handleSearch}
            value={query}
          />
          <button className="bg-btn-primary flex h-10 items-center gap-2 rounded-lg px-4 py-[11px] text-white">
            <SearchIcon />
            검색
          </button>
        </div>
      </div>

      <CustomTable<UserElement> table={table} />
    </div>
  )
}
