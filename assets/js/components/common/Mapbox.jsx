import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import mapboxgl from 'mapbox-gl'

class Mapbox extends Component {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxsZW5hbiIsImEiOiJjajNtNTF0Z2QwMDBkMzdsNngzbW4wczJkIn0.vLlTjNry3kcFE7zgXeHNzQ'

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-100.436, 37.778], //US center
      zoom: 3
    })
    map.addControl(new mapboxgl.NavigationControl())
    map.scrollZoom.disable()

    let bounds = new mapboxgl.LngLatBounds()
    let features = []

    map.on('load', () => {
      this.props.elements.forEach(element => {
        features.push({
          "type": "Feature",
          "properties": {
            "description": `<div><p class="blue">${element.name}</p><p>${element.longitude}, ${element.latitude}</p></div>`
          },
          "geometry": {
            "type": "Point",
            "coordinates": [element.longitude, element.latitude]
          }
        })

        bounds.extend([element.longitude, element.latitude])
      })

      map.addLayer({
        "id": "outerCircle",
        "type": "circle",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": features
          }
        },
        'paint': {
          'circle-color': '#2196F3',
          'circle-opacity': 0.4,
          'circle-radius': {
            type: 'exponential',
            stops: [
              [0, 4], [10,7], [12, 25], [14, 120], [22,3000]
            ]
          }
        }
      })

      map.addLayer({
        "id": "innerCircle",
        "type": "circle",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": features
          }
        },
        'paint': {
          'circle-color': '#E3F2FD',
          'circle-radius': {
            type: 'exponential',
            stops: [
              [0, 2], [10,3], [12, 3], [14, 5], [22,20]
            ]
          }
        }
      })

      if (this.props.elements.length > 0) {
        map.fitBounds(bounds, {
          padding: {top: 100, bottom: 100, left: 100, right: 100}
        })
      }

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false
      })

      map.on('mouseenter', 'innerCircle', function(e) {
        map.getCanvas().style.cursor = 'pointer'

        var coordinates = e.features[0].geometry.coordinates.slice()
        var description = e.features[0].properties.description

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        popup.setLngLat(coordinates)
          .setHTML(description)
          .addTo(map)
      })

      map.on('mouseleave', 'innerCircle', function() {
        map.getCanvas().style.cursor = ''
      })
    })
  }

  render() {
    const style = {
      width: '100%',
      height: '600px'
    }

    return <div style={style} ref={el => this.mapContainer = el} />
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ push }, dispatch)
}

export default connect(null, mapDispatchToProps)(Mapbox)