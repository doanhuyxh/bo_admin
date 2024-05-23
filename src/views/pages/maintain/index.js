// ** React Imports
import { Fragment, memo, useState, useEffect } from 'react'
import './index.scss'
import _ from 'lodash'
import { toast } from 'react-toastify';
import Service from '../../../services/request'
import '@styles/react/libs/tables/react-dataTable-component.scss'

import DataTable from 'react-data-table-component'
import {
  Card,
  Button,
  Input
} from 'reactstrap'

const DataTableServerSide = () => {
  // ** Store Vars
  const [items, setItems] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // ** React hook form vars


  function handleActionData(item, path, messageSuccess) {
    const token = window.localStorage.getItem('accessToken')

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path, data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(`${messageSuccess} successful!`)

          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
      })
    }
  }

  function getData() {
    setIsLoading(true)
  
      // @ts-ignore
      Service.send({
        method: 'POST', path: 'Maintain/getSystemStatus', data: {}
      }).then(res => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {

            setItems(data)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
        setIsLoading(false)
      })
    
  }

  useEffect(() => {
    getData()
  }, [])

  const serverSideColumns = [
    {
      name: '',
      selector: 'text',
      sortable: true,
      maxWidth: '200px'
    },
    {
      name: 'Status',
      selector: 'text',
      sortable: true,
      minWidth: '250px',
      cell: (row) => {
        const { key } = row
        if(key ==="maintainMessage"){
          
          return (
            <Input onBlur={(e) => {
              const { value } = e.target
              
              setItems({
                ...items,
                [key]: value
              })
            }} type='text' defaultValue={items[key]} name={key} bsSize='sm' >
            
            </Input>
          )
        }
        return (
          <Input onChange={(e) => {
            const { value } = e.target

            setItems({
              ...items,
              [key]: value === 'true'
            })
          }} type='select' value={items[key] || false} name={key} bsSize='sm' >
            <option value={true}>On</option>
            <option value={false}>Off</option>
          </Input>
        )
       
      }
    },
    {
      name: 'Action',
      selector: 'action',
      cell: (row) => {
        const {
          text,
          path,
          key
        } = row

        if(key ==="maintainMessage"){
          return (
            <>
              <Button.Ripple onClick={() => {
                handleActionData({
                  message: items[key] || "",
                }, path, text)
              }} color='primary' size="sm">{'Update'}</Button.Ripple>
            </>
          )
        }
        return (
          <>
            <Button.Ripple onClick={() => {
              handleActionData({
                status: items[key] || false,
              }, path, text)
            }} color='primary' size="sm">{'Update'}</Button.Ripple>
          </>
        )
      }
    }
  ]

  return (
    <Fragment>
      <Card className="accountAdmin">
        <h2 style={{ border: 'unset' }} className="content-header-title mb-2" >Maintain WEB</h2>

        <DataTable
          noHeader
          className='react-dataTable'
          columns={serverSideColumns}
          data={[
            {
              text: 'ALL WEB',
              path: 'Maintain/maintainAll',
              key: 'all'
            },
            {
              text: 'Live Game',
              path: 'Maintain/maintainLiveGame',
              key: 'liveGame'
            },
            {
              text: 'Deposit',
              path: 'Maintain/maintainDeposit',
              key: 'deposit'
            },
           
            {
              text: 'Withdraw',
              path: 'Maintain/maintainWithdraw',
              key: 'withdraw'
            },
            {
              text: 'Signup New USER',
              path: 'Maintain/maintainSignup',
              key: 'signup'
            },
            {
              text: 'Text Forgot Password',
              path: 'Maintain/maintainForgotPassword',
              key: 'maintainMessage'
            }

          ]}
          progressPending={isLoading}
        />
      </Card>


    </Fragment >
  )
}

export default memo(DataTableServerSide)
