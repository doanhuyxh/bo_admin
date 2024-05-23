// @ts-nocheck
import { Users } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'

const SubscribersGained = ({ kFormatter, data, title = "", icon, color="primary" }) => {
 
  return data !== null ? (
    <StatsWithAreaChart
      icon={icon ? icon :<Users size={21} />}
      color={color}
      stats={kFormatter(data)}
      statTitle={title}
      series={[]}
      type='area'
    />
  ) : null
}

export default SubscribersGained
