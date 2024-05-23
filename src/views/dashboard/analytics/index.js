// @ts-nocheck
import { useContext, useState, useEffect } from 'react'
import { kFormatter } from '@utils'
import InvoiceList from './../user'
import BetRecord from './../bet-record'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { Row, Col, Card, CardBody, Label } from 'reactstrap'
import { toast } from 'react-toastify';
import { Box, UserPlus, Sun, Briefcase, CreditCard } from 'react-feather'
import { useSelector } from 'react-redux'
import CardCongratulations from '@src/views/ui-elements/cards/advance/CardCongratulations'
import SubscribersGained from '@src/views/ui-elements/cards/statistics/SubscribersGained'
import Service from '../../../services/request'
import Flatpickr from 'react-flatpickr'
import moment from "moment"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/charts/apex-charts.scss'

const AnalyticsDashboard = (props) => {

  const [endDate, setEndPicker] = useState(moment().endOf('month').toDate())
  const [startDate, setStartPicker] = useState(moment().startOf('month').toDate())
  
  const [items, setItems] = useState({})
  
  function handleGetData(params){
    const newParams = {
      ...params
    }
    

    Service.send({
      method: 'POST', path: 'SystemReport/summaryReport', data: newParams}).then(res => {
      if (res) {
        const { statusCode, data, message } = res
        
        if (statusCode === 200) {
          
          setItems(data)
        } else {
          toast.warn(message || 'Something was wrong!')
        }
      } else {
       
        setItems({})
      }
    })
  }

  useEffect(()=>{
    handleGetData({ endDate, startDate})
  },[])

 
  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col lg='6' sm='12'>
          <CardCongratulations />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained data={items.newUser || 0} color={"success"} title={"New User"} icon={<UserPlus size={21}/>} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained data={items.allUser || 0} title={"All User"} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained data={items.totalBet || 0} color={"info"} title={"Total bet"} icon={<Box size={21}/>} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained data={items.totalWinLose || 0} color={"warning"} title={"Total win/lose "} icon={<Sun size={21}/>} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained data={items.totalDeposit|| 0} color={"danger"} title={"Total Deposit"} icon={<Briefcase size={21}/>} kFormatter={kFormatter} />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained data={items.totalWithdraw || 0} color={"dark"} title={"Total Withdraw"} icon={<CreditCard size={21}/>} kFormatter={kFormatter} />
        </Col>
      </Row>
    
        <Card>
          <CardBody
            className={"pb-10"}
          >
            <Row className='match-height'>
               <Col md='3' sm='12'>
                <Label for='startDate'>Start Date</Label>
                <Flatpickr
                  value={startDate}                
                  className='form-control'
                  onChange={date => {
                   
                    setStartPicker(date[0])
                    handleGetData({startDate: date[0], endDate})
                  }}
                />
               </Col>
               <Col md='3' sm='12'>
                <Label for='endDate'>End Date</Label>
                <Flatpickr
                  value={endDate}               
                  
                  className='form-control'
                  onChange={date => {
                    setEndPicker(date[0])
                    handleGetData({endDate: date[0], startDate})
                  }}
                />
               </Col>
            </Row>  
          </CardBody>
          
        </Card>
       
      <Row className='match-height'>
        <Col xs='12'>
          <div className='invoice-list-dataTable'>
            <InvoiceList {...props}/>
          </div>
        </Col>
        <Col xs='12'>
          <div className='invoice-list-dataTable'>
            <BetRecord {...props}/>
          </div>
        </Col>
      </Row>
   
    </div>
  )
}

export default AnalyticsDashboard
