import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { fetchGateways, deleteGateway } from '../../actions/gateway'
import RandomGatewayButton from './RandomGatewayButton'
import GatewaysTable from './GatewaysTable'
import DashboardLayout from '../common/DashboardLayout'
import BlankSlate from '../common/BlankSlate'

// MUI
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography';

class GatewayIndex extends Component {
  componentDidMount() {
    this.props.fetchGateways()
  }

  render() {
    const { gateways, deleteGateway } = this.props

    if (gateways.length === 0) {
      return (
        <DashboardLayout title="All Gateways" tabs={tabs}>
          <Paper>
            <BlankSlate
              title="No gateways"
              subheading="To create a new gateway, click the red button in the corner"
            />
            <RandomGatewayButton />
          </Paper>
        </DashboardLayout>
      )
    }

    const listView = (
      <Paper>
        <GatewaysTable gateways={gateways} deleteGateway={deleteGateway} />
      </Paper>
    )

    const mapView = (
      <Paper>
        <Typography variant="display1" style={{textAlign: 'center', padding: '3em', color: "#e0e0e0"}}>
          Map goes here
        </Typography>
      </Paper>
    )

    const tabs = [{
      label: "List View",
      content: listView,
    }, {
      label: "Map View",
      content: mapView
    }]

    return(
      <DashboardLayout title="All Gateways" tabs={tabs}>
        <RandomGatewayButton />
      </DashboardLayout>
    )
  }
}

function mapStateToProps(state) {
  return {
    gateways: Object.values(state.entities.gateways)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchGateways, deleteGateway }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GatewayIndex);