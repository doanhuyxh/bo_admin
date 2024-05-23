// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { MoreVertical, Edit, Lock } from 'react-feather'
import _ from 'lodash'
import './index.scss'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import { number_to_price } from "./../../../helper/common"
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, InputGroup,
  InputGroupButtonDropdown, Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form
} from 'reactstrap'
import moment from 'moment'
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 1, label: 'Active' },
  { value: 0, label: 'Lock' },
]


const DefaultFilter = {
  filter: {
    active: 1
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc"
  }
}
const List_Search_Filter = [
  "username",
  "email",
  "referUserAgent",
  "phoneNumber",
]
const DataTableServerSide = () => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: 'ID',
      selector: 'userId',
      sortable: true,
      maxWidth: '60px'
    },
    {
      name: 'Username',
      selector: 'username',
      sortable: true,
      minWidth: '100px'
    },
    {
      name: 'Phone Number',
      selector: 'phoneNumber',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Active',
      selector: 'active',
      sortable: true,
      maxWidth: '100px',
      cell: (row) => {
        const { active } = row

        return (
          <div>
            {active ? "Active" : "Lock"}
          </div>
        )
      }
    },
    {
      name: 'Balance',
      selector: 'balance',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => {
        const { balance } = row

        return (
          <div>
            {number_to_price(balance)}
          </div>
        )
      }
      
    },
    {
      name: 'Created',
      selector: 'salary',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => {
        const { createdAt } = row

        return (
          <div>
            {moment(createdAt).format('lll')}
          </div>
        )
      }
    },
 
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const dispatch = useDispatch()


  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('username')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }
    Object.keys(newParams.filter).forEach(key => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem('accessToken')

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'User/getListlUser', data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            
            setItems(data.data)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        } else {
          setTotal(1)
          setItems([])
        }
        if (!isNoLoading) {
          setIsLoading(false)
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  function handleUpdateData(item, messageSuccess) {
    const token = window.localStorage.getItem('accessToken')

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'User/updateUserById', data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(messageSuccess || 'Action update successful!')
            getData(paramsFilter)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
      })
    }
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 2000);

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
  }, [])

  // ** Function to handle filter
  const handleFilter = e => {
    const { value } = e.target
    setSearchValue()
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [searchField]: value,
      },
      skip: 0
    }
    getDataSearch(newParams)

  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {

    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)

  }

  // ** Function to handle per page
  const handlePerPage = e => {

    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    getData(newParams)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handleChangeSearchField = (filed) => {
    const newParams = {
      ...paramsFilter,
      skip: 0,
    }
    List_Search_Filter.forEach(text => {
      delete newParams.filter[text]
    })
    newParams.filter[filed] = ''
    setSearchValue('')
    setSearchField(filed)
    getData(newParams)
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
    }
    getData(newParams)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        }
      />
    )
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOnchange = (name, value) => {
    setUserData(
      {
        ...userData,
        [name]: value
      }
    )
  }

  return (
    <Fragment>
      <Card>

        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
          <h2 for='sort-select'>New User</h2>
          </Col>
         
        </Row>
     
        <DataTable
          noHeader
          
          paginationServer
          className='react-dataTable'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={items}
          progressPending={isLoading}
        />
      </Card>

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        className={`modal-dialog-centered `}

      >
        <ModalHeader toggle={() => setModal(false)}>
          Edit User Info
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit((data) => {
            handleUpdateData({
              id: userData.userId,
              data
            })
            setModal(false)
          })}>
            <FormGroup>
              <Label >Status</Label>
              <Input
                type='select'
                name='active'
                innerRef={register({ required: true })}
                invalid={errors.active && true}
                value={userData.active}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              >
                <option value={1}>Active</option>
                <option value={0}>Lock</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for='firstName'>First Name</Label>
              <Input
                id='firstName'
                name='firstName'
                innerRef={register({ required: true })}
                invalid={errors.firstName && true}
                placeholder='Bruce'
                value={userData.firstName || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='lastName'>Last Name</Label>
              <Input

                id='lastName'
                name='lastName'
                innerRef={register({ required: true })}
                invalid={errors.lastName && true}
                placeholder='Wayne'
                value={userData.lastName || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='phoneNumber'>Phone Number</Label>
              <Input
                innerRef={register({ required: true })}
                invalid={errors.lastNameBasic && true}
                name='phoneNumber'
                placeholder='+84943881692'
                options={{ phone: true, phoneRegionCode: 'VI' }}
                value={userData.phoneNumber || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='limitWithdrawDaily'>Limit Withdraw Daily</Label>
              <Input
                name='limitWithdrawDaily'
                id='limitWithdrawDaily'
                innerRef={register({ required: true })}
                invalid={errors.limitWithdrawDaily && true}
                value={userData.limitWithdrawDaily || 0}
                placeholder='Limit Withdraw Daily'
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup className='d-flex mb-0'>
              <Button.Ripple className='mr-1' color='primary' type='submit'>
                Submit
            </Button.Ripple>

            </FormGroup>
          </Form>
        </ModalBody>

      </Modal>

    </Fragment >
  )
}

export default memo(DataTableServerSide)
