import React, { Component } from 'react';
/*eslint-disable */
class Event extends Component {
  constructor(props) {
    super(props);
    // Initialize these variables
    this.start_date = new Date( this.props.data.start_time );
    this.date_str = this.start_date.toString();
  }

  componentWillUpdate( nextProps ) {
    // If the props being passed change, we want to update these
    // variables
    this.start_date = new Date( nextProps.data.start_time );
    this.date_str = this.start_date.toString()
  }

  render() {
    let className = this.props.currentEvent === this.props.id ? 'center currentEvent' : '';
    return (
        <article className = { className }>
          <h4 className="eventTitle clickable" onClick={ this.props.clickHandler.bind(null, this.props.id) }>{ this.props.data.title }</h4>
            <div className="event">
              <img className="pin" src="http://maps.google.com/mapfiles/ms/icons/pink-dot.png"></img>
              <div className="eventText">
                <span className="venueName">{ this.props.data.venue_name }</span>
                <div className="eventDate">{ this.date_str.substr(0, 21) }</div>
              </div>
            </div>
        </article>
    );
  }
}

Event.propTypes = { data: React.PropTypes.object.isRequired };
/*eslint-enable */
export default Event;
