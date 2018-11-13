import React, {PropTypes, Component } from 'react';

class Marker extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const style = this.props.hover ? styles2 : styles;

    return (
      <div className="hint hint--html hint--success hint--top" style={style}>
        <div  className="hint__content">
          <div style={{width: 80}}>
            {this.props.centroPoblado}
          </div>
          <br/>
          <div>
            {this.props.pqrs}
          </div>
        </div>
      </div>
    );
  }
}

const K_WIDTH = 10;
const K_HEIGHT = 10;
const styles = {
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: '5px solid #f44336',
  borderRadius: K_HEIGHT,
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer'
}

const styles2 = {
  ...styles,
  border: '5px solid #3f51b5',
  color: '#f44336'
};
export default Marker;
