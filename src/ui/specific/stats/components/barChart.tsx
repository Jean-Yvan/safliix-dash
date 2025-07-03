'use client'

import { ResponsiveBar } from '@nivo/bar'

const data = [
  {
    month: 'Jan',
    abonnements: 120,
    locations: 80,
  },
  {
    month: 'Feb',
    abonnements: 150,
    locations: 95,
  },
  {
    month: 'Mar',
    abonnements: 200,
    locations: 130,
  },
  {
    month: 'Apr',
    abonnements: 180,
    locations: 110,
  },
  {
    month: 'May',
    abonnements: 220,
    locations: 140,
  },
  {
    month: 'Jun',
    abonnements: 190,
    locations: 120,
  },
  {
    month: 'Jul',
    abonnements: 210,
    locations: 150,
  },
  {
    month: 'Aug',
    abonnements: 230,
    locations: 170,
  },
  {
    month: 'Sep',
    abonnements: 200,
    locations: 140,
  },
  {
    month: 'Oct',
    abonnements: 190,
    locations: 130,
  },
  {
    month: 'Nov',
    abonnements: 170,
    locations: 110,
  },
  {
    month: 'Dec',
    abonnements: 160,
    locations: 100,
  },
]

const MonthlyStatsChart = () => {
  return (
    <div style={{ height: 330 }}>
      <ResponsiveBar
        data={data}
        keys={['abonnements', 'locations']}
        indexBy="month"
        margin={{ top: 20, right: 60, bottom: 20, left: 60 }}
        padding={0.5}
        groupMode="grouped"
        enableGridX={false}
        enableGridY={true}        
       colors={({ id }) => {
        if (id === 'abonnements') return '#A5C0E4' // Indigo
        if (id === 'locations') return '#792525'   // Orange
        return '#cccccc' // Default color to satisfy type
      }}
        theme={{
          grid:{
            line:{
              stroke:"#792525",
              strokeDasharray:"4 4"
            }
          }
        }}
        borderRadius={4}
        enableLabel={false}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Mois',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Nombre',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        
        animate={true}
        motionConfig="wobbly"
        tooltip={({id, value, indexValue}) => (
          <div style={{
            background: '#1f2937',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 6,
            fontSize: 13,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}>
          <strong>{id}</strong> – {indexValue}<br />
            {value} vues
          </div>
        )}  
      />
    </div>
  )
}

export default MonthlyStatsChart
