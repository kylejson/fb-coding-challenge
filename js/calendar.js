  // Global vars, constants, and test data
  var testData = [ {start: 540, end: 600}, {start: 560, end: 620}, {start: 30, end: 150}, {start: 610, end: 670}],
      eventsContainer = $('.events'),
      eventsContainerWidth = 600,
      eventsContainerPadding = 10,
      eventBorderWidth = 3;

  /**
  * Takes an array of events sorts, groups, and assigns them new object values to describe their proper organization.
  * Then the events are passed to renderEvents()
  *
  * @method layOutDay()
  * @param {Object Array} events An array of event objects that look like {start: 00, end: 00}
  */
  function layOutDay(events) {
    //Sort events by their start date
    events = _.sortBy(events, function(event){ 
      return event.start; 
    });

    //Local vars to keep track of columns, eventsSubgroup holds the current event "chain" of intersections and the maxEnd of that group
    var numColumns = 0,
        eventSubgroups = [],
        subGroup = {end: 0};

      //Foreach event in events check for intersection with the last event in the subGroup, push the current event and keep track of the current max end time
    _.forEach(events, function(event, index){
      if(event.start >= subGroup.end || eventSubgroups.length === 0) {
        eventSubgroups.push({columns: [{end: 0}], end: 0});
        subGroup = _.last(eventSubgroups);
        numColumns = 0;
      };
      //If the current stacks end is greater then the subgroups then te subgroup end changes to the tru max end
      if(event.end >subGroup.end) {
        subGroup.end = event.end;
      }
      //The events column should always assume worst case at first that the max intersections in the number of columns required
      event.column = numColumns;

      //Some space may be available so here we check if the next events start is greater then the first subgroup event's columns end time.
      _.some(subGroup.columns, function(currentColumn, index) {
        if(numColumns !== 0 && event.start > currentColumn.end) {
          event.column = index;
        }else{
          numColumns++;
        }
      });
      //reset the current max end
      subGroup.columns[event.column] = {
        end: event.end
      };
      //Give the event its subgroup information
      event.subGroup = subGroup;
    });

    // process the new events with their subgroup information incorporating constants for the style constraints
    _.forEach(events, function(event) {
      event.top = event.start;
      event.left = eventsContainerWidth / event.subGroup.columns.length * event.column + eventsContainerPadding + eventBorderWidth;
      event.width = eventsContainerWidth / event.subGroup.columns.length - eventsContainerPadding + eventBorderWidth;
      delete event.subGroup;
      delete event.column;
    });

    // pass the processed events to get rendered.
    renderEvents(events);
  };

  /**
  * Takes an array of the proccessed events, clears the parent container for the calendar, loops through each event and prepares/appends them into a div.
  *
  * @method renderEvents()
  * @param {Object Array} processedEvents An array of events processed that look like {start: 00, end: 00, top: 00, left: 00, width: 00}
  */
  function renderEvents(processedEvents) {
    //
    eventsContainer.children().remove();

    //loop through the processed events and prepare a div container to render them to and append to 
    _.forEach(processedEvents, function(event, index){
      var eventTemplate = $('<div>').addClass('event').css({
        left: event.left + 'px',
        width: event.width + 'px',
        height: event.end-event.start + 'px',
        top: event.top + 'px'
      });
      eventTemplate.append('<b>Sample Item</b><p class="small">Sample Location</p>');
      eventTemplate.appendTo(eventsContainer);
    });
  }

  // used lodash sort function instead
  // function sortEventsByProperty(property) {
  //   return function (a, b) {
  //     var sortFlag = 0;
  //     if (a[property] < b[property]) {
  //       sortFlag = -1;
  //     } else if (a[property] > b[property]) {
  //       sortFlag = 1;
  //     }

  //     return sortFlag;
  //   };
  // }

    layOutDay(testData);
