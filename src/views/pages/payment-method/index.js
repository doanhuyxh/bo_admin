// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { MoreVertical, Edit, Delete } from 'react-feather'
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
  { value: 'New', label: 'New' },
  { value: 'Waiting', label: 'Waiting' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Deleted', label: 'Deleted' },
  { value: 'Canceled', label: 'Canceled' },
]


const DefaultFilter = {
  filter: {
   
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc"
  }
}
const List_Search_Filter = [
  "userPaymentMethodName",
  "userPaymentMethodReceiverName",
  "userPaymentMethodReferName",
  "userPaymentMethodReceiverName",
]
const DataTableServerSide = () => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: 'ID',
      selector: 'userPaymentMethodId',
      sortable: true,
      maxWidth: '60px'
    },
    {
      name: 'Payment Method Name',
      selector: 'userPaymentMethodName',
      sortable: true,
      minWidth: '100px'
    },
    {
      name: 'IdentityNumber',
      selector: 'userPaymentMethodIdentityNumber',
      sortable: true,
      minWidth: '200px'
    },
    {
      name: 'Payment Method ReferName',
      selector: 'userPaymentMethodReferName',
      sortable: true,
      maxWidth: '200px'
    },
    {
      name: 'Payment Method Receiver Name',
      selector: 'userPaymentMethodReceiverName',
      sortable: true,
      maxWidth: '200px'
    }
     ,
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
    {
      name: 'Action',
      selector: 'action',
      cell: (row) => {
        const {
          userPaymentMethodId,
          userPaymentMethodName,
          userPaymentMethodIdentityNumber,
          userPaymentMethodReferName,
          userPaymentMethodReceiverName
        } = row
        return (
          <UncontrolledDropdown>
            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href='/' onClick={e => {
                e.preventDefault(); setModal(true); setUserData({
                  userPaymentMethodId,
                  userPaymentMethodName,
                  userPaymentMethodIdentityNumber,
                  userPaymentMethodReferName,
                  userPaymentMethodReceiverName
                })
              }}>
                <Edit className='mr-50' size={15} /> <span className='align-middle'>Edit</span>
              </DropdownItem>
              <DropdownItem href='/' onClick={e => {
                e.preventDefault();
                handleUpdateData({
                  id: userPaymentMethodId, 
                  data: {
                    isDeleted: true
                  }
                })
              }}>
                <Delete className='mr-50' size={15} /> <span className='align-middle'>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
 
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('userPaymentMethodName')
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
        method: 'POST', path: 'UserPaymentMethod/getList', data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, data, message } = res
          
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.length)
            setItems(data)
            
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
   
      Service.send({
        method: 'POST', path: 'UserPaymentMethod/updateById', data: item, query: null
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

  function handleAddPaymentData(item) {
   
    Service.send({
      method: 'POST', path: 'UserPaymentMethod/insert', data: item, query: null
    }).then(res => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          toast.success( 'Action successful!')
          getData(paramsFilter)
        } else {
          toast.warn(message || 'Something was wrong!')
        }
      }
    })
  
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
          <Col sm='11'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>show</Label>
              <Input
                className='dataTable-select'
                type='select'
                bsSize='sm'
                id='sort-select'
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}
              >

                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
              <Label for='sort-select'>entries</Label>
            </div>
          </Col>
          <Col sm="1">
            <Button.Ripple color='primary'
              size="sm"
              onClick={() => {
                setModal(true);
                 setUserData({
                  
                })
              }}>
              Add
            </Button.Ripple>
          </Col>
          {/* <Col sm='2'>
            <Input onChange={(e) => {
              const { name, value } = e.target
              handleFilterChange(name, value)
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.active || '') : ''} name='active' bsSize='sm' >
              {
                statusOptions.map(item => {
                  return <option value={item.value}>{item.label}</option>
                })
              }
            </Input>
          </Col>
         */}
          {/* <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            <Label className='mr-1' for='search-input'>
              Search
            </Label>
            <InputGroup className="input-search-group">
              <InputGroupButtonDropdown addonType='prepend' isOpen={dropdownOpen} toggle={toggleDropDown}>
                <DropdownToggle size="sm" color='primary' caret outline>
                  {searchField}
                </DropdownToggle>
                <DropdownMenu>
                  {
                    List_Search_Filter.map(text => (
                      <DropdownItem className="dropdownItem-search" onClick={() => { handleChangeSearchField(text) }} key={text}>{text}</DropdownItem>
                    ))
                  }


                </DropdownMenu>
              </InputGroupButtonDropdown>

              <Input
                className='dataTable-filter'
                type='text'
                bsSize='sm'
                id='search-input'
                value={searchValue}
                onChange={(e) => { handleFilter(e) }}
              />
            </InputGroup>

          </Col> */}
        
        </Row>
        <DataTable
          noHeader
          pagination
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
          {userData.userPaymentMethodId ? "Edit" : "Add"} Payment Method Info
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit((data) => {
            if(userData.userPaymentMethodId){
              handleUpdateData({
                id: userData.userPaymentMethodId,
                data
              })
            }else{
              handleAddPaymentData(data)
            }
            
            setModal(false)
          })}>
          
            <FormGroup>
              <Label for='userPaymentMethodName'>Payment Method Name</Label>
              <Input
                id='userPaymentMethodName'
                name='userPaymentMethodName'
                innerRef={register({ required: true })}
                invalid={errors.userPaymentMethodName && true}
                placeholder='ATM / BANK'
                value={userData.userPaymentMethodName || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='userPaymentMethodIdentityNumber'>Payment Method IdentityNumber</Label>
              <Input
                id='userPaymentMethodIdentityNumber'
                name='userPaymentMethodIdentityNumber'
                innerRef={register({ required: true })}
                invalid={errors.userPaymentMethodIdentityNumber && true}
                placeholder='1234789'
                value={userData.userPaymentMethodIdentityNumber || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='userPaymentMethodReferName'>Payment Method Refer Name</Label>
              <Input
                id='userPaymentMethodReferName'
                name='userPaymentMethodReferName'
                innerRef={register({ required: true })}
                invalid={errors.userPaymentMethodReferName && true}
                placeholder='Citi Bank'
                value={userData.userPaymentMethodReferName || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='userPaymentMethodReceiverName'>Payment Method Receiver Name</Label>
              <Input
                name='userPaymentMethodReceiverName'
                id='userPaymentMethodReceiverName'
                innerRef={register({ required: true })}
                invalid={errors.userPaymentMethodReceiverName && true}
                value={userData.userPaymentMethodReceiverName || ""}
                placeholder='David Beckam'
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
