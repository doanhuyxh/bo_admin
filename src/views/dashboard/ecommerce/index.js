import { useContext } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap'
import CompanyTable from './CompanyTable'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import Earnings from '@src/views/ui-elements/cards/analytics/Earnings'
import CardMedal from '@src/views/ui-elements/cards/advance/CardMedal'
import CardMeetup from '@src/views/ui-elements/cards/advance/CardMeetup'
import StatsCard from '@src/views/ui-elements/cards/statistics/StatsCard'
import GoalOverview from '@src/views/ui-elements/cards/analytics/GoalOverview'
import RevenueReport from '@src/views/ui-elements/cards/analytics/RevenueReport'
import OrdersBarChart from '@src/views/ui-elements/cards/statistics/OrdersBarChart'
import ProfitLineChart from '@src/views/ui-elements/cards/statistics/ProfitLineChart'
import CardTransactions from '@src/views/ui-elements/cards/advance/CardTransactions'
import CardBrowserStates from '@src/views/ui-elements/cards/advance/CardBrowserState'

import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'

const EcommerceDashboard = () => {
  const { colors } = useContext(ThemeColors),
    trackBgColor = '#e9ecef'
  const userData = JSON.parse(localStorage.getItem('userData') || `{}`)
  const { permissions = '' } = userData
  const arrayPers = permissions === '' ? [] : permissions.split(',')

  let check = false

  const index = arrayPers.findIndex(el2 => el2 === "VIEW_DASHBOARD")
  if (index !== -1) {
    check = true
  }

  return (
    <div id='dashboard-ecommerce'>
      {
        check ? (<>
          <Row className='match-height'>
            <Col xl='4' md='6' xs='12'>
              <CardMedal />
            </Col>
            <Col xl='8' md='6' xs='12'>
              <StatsCard cols={{ xl: '3', sm: '6' }} />
            </Col>
          </Row>
          <Row className='match-height'>
            <Col lg='4' md='12'>
              <Row className='match-height'>
                <Col lg='6' md='3' xs='6'>
                  <OrdersBarChart warning={colors.warning.main} />
                </Col>
                <Col lg='6' md='3' xs='6'>
                  <ProfitLineChart info={colors.info.main} />
                </Col>
                <Col lg='12' md='6' xs='12'>
                  <Earnings success={colors.success.main} />
                </Col>
              </Row>
            </Col>
            <Col lg='8' md='12'>
              <RevenueReport primary={colors.primary.main} warning={colors.warning.main} />
            </Col>
          </Row>
          <Row className='match-height'>
            <Col lg='8' xs='12'>
              <CompanyTable />
            </Col>
            <Col lg='4' md='6' xs='12'>
              <CardMeetup />
            </Col>
            <Col lg='4' md='6' xs='12'>
              <CardBrowserStates colors={colors} trackBgColor={trackBgColor} />
            </Col>
            <Col lg='4' md='6' xs='12'>
              <GoalOverview success={colors.success.main} />
            </Col>
            <Col lg='4' md='6' xs='12'>
              <CardTransactions />
            </Col>
          </Row>
        </>) : (
            <>
              <Row>
                <Col md='12' sm='12'>
                  <Card>
                    <CardBody>
                      <CardTitle tag='h4'>Welcome, you</CardTitle>
                      <CardText>You have successfully logged in as user to BOS. Now you can start to explore. Enjoy!</CardText>

                    </CardBody>
                  </Card>
                </Col>



              </Row>
            </>
          )
      }

    </div>
  )
}

export default EcommerceDashboard
