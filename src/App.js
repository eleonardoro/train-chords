import React, { useEffect, useState, Suspense } from "react";
import FlagIcon from "./FlagIcon.js";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";
const allChords = ["C", "D", "E", "F", "G", "A", "B"];
const allChordsFalse = [false, false, false, false, false, false, false];
const allChordsTrue = [true, true, true, true, true, true, true];

function App() {

  const [chords, setChords] = useState( allChordsFalse );
  const [showingChord, setShowingChord] = useState( "" );
  const [showingChordPosition, setShowingChordPosition] = useState();
  const [chordsToShowVar, setChordsToShowVar] = useState( [] );
  const [orderToShow, setOrderToShow] = useState( "" );
  const [contIterations, setContIterations] = useState( 0 );
  const [dateStarted, setDateStarted] = useState();
  const [changeMode, setChangeMode] = useState( "" );
  const [changeChordTime, setChangeChordTime] = useState( 10 );
  const [stopMode, setStopMode] = useState( "" );
  const [stopVariableIterations, setStopVariableIterations] = useState( 10 );
  const [stopVariableMinutes, setStopVariableMinutes] = useState( 10 );
  const [isActive, setIsActive] = useState( false );


  const handleCheckChords = e => {
    const index = allChords.findIndex( x => x === e.target.value );

    var chordsAux = [...chords];
    chordsAux[index] = !chordsAux[index];
    setChords( chordsAux );

  };

  const handleInvertCheckChords = () => {
    var chordsAux = [...chords];
    setChords( chordsAux.map( bool => { return !bool; } ) );
  };

  const createChordsToShow = () => {
    var chordsAux = [];
    chords.forEach( ( value, index ) => {
      if ( value )
        chordsAux.push( allChords[index] );
    } );

    return chordsAux;
  };

  const isAllFalse = array => { return array.every( v => v === false ); };

  const isFieldsValid = () => {
    if ( isAllFalse( chords ) ) {
      window.alert( t( "selectAtLeastOne.label" ) );
      return false;
    }

    //Getting the order to show the Chords
    if ( !orderToShow ) {
      window.alert( t( "selectTheOrder.label" ) );
      return false;
    }

    //Getting the way to change
    if ( !changeMode ) {
      window.alert( t( "selectTheChange.label" ) );
      return false;
    }

    if ( changeMode === "automatic" ) {

      if ( ( !changeChordTime || changeChordTime === 0 ) ) {
        window.alert( t( "insertTime.label" ) );
        return false;
      }

      if ( changeChordTime < 2 ) {
        window.alert( t( "youAreNotThatFast.label" ) );
        return false;
      }

      if ( !stopMode ) {
        window.alert( t( "selectStop.label" ) );
        return false;
      }

      if ( stopMode === "afterIterations" && ( !stopVariableIterations || stopVariableIterations === 0 ) ) {
        window.alert( t( "insertIterations.label" ) );
        return false;
      }

      if ( stopMode === "afterMinutes" && ( !stopVariableMinutes || stopVariableMinutes === 0 ) ) {
        window.alert( t( "insertMinutes.label" ) );
        return false;
      }
    }

    return true;
  };

  const printChoices = () => {
    console.log( t( "started.label" ) );
    console.log( "==== " + t( "chords.label" ) + " ====" );
    console.log( createChordsToShow() );
    console.log( orderToShow );
    console.log( changeMode );
    if ( changeMode === "automatic" )
      console.log( changeChordTime );
    console.log( "================" );
  };

  const handleOrderToShowChange = changeEvent => { setOrderToShow( changeEvent.target.value ); };

  const handleChangeModeChange = changeEvent => {
    setChangeMode( changeEvent.target.value );

    if ( changeEvent.target.value === "manually" ) {
      setStopMode( "" );
    }
  };

  const handleChangeChordTimeChange = changeEvent => {
    if ( changeEvent.target.value )
      setChangeChordTime( parseInt( changeEvent.target.value ) );
    else
      setChangeChordTime( "" );
  };

  const handleStopModeChange = changeEvent => { setStopMode( changeEvent.target.value ); };

  const handleStopIterationsVariableChange = changeEvent => {
    if ( changeEvent.target.value )
      setStopVariableIterations( parseInt( changeEvent.target.value ) );
    else
      setStopVariableIterations( "" );
  };

  const handleStopMinutesVariableChange = changeEvent => {
    if ( changeEvent.target.value )
      setStopVariableMinutes( parseInt( changeEvent.target.value ) );
    else
      setStopVariableMinutes( "" );
  };

  function diff_minutes() {
    let now = new Date().getTime();
    var diffMs = ( now - dateStarted );
    var diffMins = ( ( diffMs % 86400000 ) % 3600000 ) / 60000;

    if ( diffMins >= stopVariableMinutes )
      return true;
    return false;
  }

  const start = () => {
    if ( !isFieldsValid() ) {
      return;
    }

    setIsActive( true );
    printChoices();

    if ( changeMode === "manually" ) {
      let chordsToShow = createChordsToShow();
      setChordsToShowVar( chordsToShow );

      if ( orderToShow === "normalOrder" ) {
        setShowingChord( chordsToShow[0] );
        setShowingChordPosition( 0 );
      } else if ( orderToShow === "reverseOrder" ) {
        setShowingChord( chordsToShow[chordsToShow.length - 1] );
        setShowingChordPosition( chordsToShow.length - 1 );
      } else {
        setShowingChord( chordsToShow[Math.floor( ( Math.random() * chordsToShow.length ) )] );
      }
    }
  };

  const stop = () => {
    setShowingChord( "" );
    setChordsToShowVar( [] );
    setDateStarted( undefined );
    setContIterations( 0 );

    if ( orderToShow === "normalOrder" ) {
      setShowingChordPosition( 0 );
    } else if ( orderToShow === "reverseOrder" ) {
      var chordsToShow = createChordsToShow();
      setShowingChordPosition( chordsToShow.length - 1 );
    }

    setIsActive( false );
  };

  const nextChord = () => {

    if ( orderToShow === "normalOrder" ) {
      let position = showingChordPosition + 1;

      if ( position >= chordsToShowVar.length )
        position = 0;

      setShowingChord( chordsToShowVar[position] );

      setShowingChordPosition( position );
    } else if ( orderToShow === "reverseOrder" ) {
      let position = showingChordPosition - 1;

      if ( position < 0 )
        position = chordsToShowVar.length - 1;

      setShowingChord( chordsToShowVar[position] );
      setShowingChordPosition( position );

    } else {
      setShowingChord( chordsToShowVar[Math.floor( ( Math.random() * chordsToShowVar.length ) )] );
    }
  };

  useEffect( () => {
    let intervalChord = null;

    if ( isActive && changeMode === "automatic" ) {

      var chordsToShow = createChordsToShow();

      if ( stopMode === "afterIterations" && contIterations > ( stopVariableIterations * chordsToShow.length ) ) {
        stop();
        setShowingChord( t( "finishedAutomatically.label" ) );
        return;
      }

      if ( stopMode === "afterMinutes" && diff_minutes() ) {
        stop();
        setShowingChord( t( "finishedAutomatically.label" ) );
        return;
      }

      if ( showingChordPosition === undefined ) {
        if ( orderToShow === "normalOrder" ) {
          setShowingChordPosition( 0 );
        } else if ( orderToShow === "reverseOrder" ) {
          setShowingChordPosition( chordsToShow.length - 1 );
        }
      }

      if ( !dateStarted ) setDateStarted( new Date().getTime() );

      intervalChord = setInterval( () => {

        setShowingChord( chordsToShow[showingChordPosition] );
        setContIterations( setContIterations => setContIterations + 1 );

        if ( orderToShow === "normalOrder" ) {
          if ( showingChordPosition >= chordsToShow.length - 1 ) {
            setShowingChordPosition( 0 );
          } else {
            setShowingChordPosition( showingChordPosition => showingChordPosition + 1 );
          }
        } else if ( orderToShow === "reverseOrder" ) {
          if ( showingChordPosition <= 0 ) {
            setShowingChordPosition( chordsToShow.length - 1 );
          } else {
            setShowingChordPosition( showingChordPosition => showingChordPosition - 1 );
          }
        } else {
          setShowingChordPosition( Math.floor( ( Math.random() * chordsToShow.length ) ) );
        }
      }, changeChordTime * 1000 );


    } else {
      clearInterval( intervalChord );
      setContIterations( 0 );
    }

    return () => { clearInterval( intervalChord ); };
  }, [isActive, showingChordPosition] );

  const { t, i18n } = useTranslation();

  const changeLanguage = ( language ) => {
    i18n.changeLanguage( language );
  };

  return (
    <div className="App">
      <Suspense fallback={null}>
        <div className="float-right">
          <span onClick={() => { changeLanguage( 'en' ); }}><FlagIcon code="us" size="2x" className="flags" /></span>
          <span onClick={() => { changeLanguage( 'pt' ); }}><FlagIcon code="br" size="2x" className="flags" /></span>
        </div>
        <div className="float-left developedBy">
          {t( "developedBy.label" )} Eleonardo Oliveira -
          <a href="https://www.linkedin.com/in/eleonardo/" target="_blank"> Linkedin</a> /
          <a href="https://github.com/eleonardoro/" target="_blank"> Github</a>
        </div>
      </Suspense>
      <h1 className="App-header">{t( "trainChrods.label" )}</h1>
      <div className="container">
        <div className="row">
          <div className="col">
            {/* Chords */}
            <div className="card mx-auto card-style">
              <div className="card-body">
                <h3 className="card-title">{t( "chords.label" )}</h3>
                <div className="form-check-inline row row-checks">
                  {allChords.map( ( value, index ) => {
                    return (
                      <label className="form-check-label chords" key={value}>
                        <input
                          className="form-check-input check-chord"
                          name="chords"
                          type="checkbox"
                          id={"checkbox" + value}
                          value={value}
                          disabled={isActive}
                          checked={chords[index]}
                          onChange={handleCheckChords} />
                        {value}</label> );
                  } )}
                </div>
                <div className="checks">
                  <span className="check-options" onClick={() => { if ( !isActive ) setChords( allChordsTrue ); }}>{t( "checkAllChords.label" )}</span>
                  <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <span className="check-options" onClick={() => { if ( !isActive ) setChords( allChordsFalse ); }}>{t( "uncheckAllChords.label" )}</span>
                  <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <span className="check-options" onClick={() => { if ( !isActive ) handleInvertCheckChords(); }}>{t( "invertCheckChords.label" )}</span>
                </div>
              </div>
            </div>
            {/* Order */}
            <div className="card mx-auto card-style" >
              <div className="card-body">
                <h3 className="card-title">{t( "order.label" )}</h3>
                <div className="form-check form-check-inline">
                  <label className="form-check-label order-labels" >
                    <input
                      className="form-check-input order-inputs"
                      type="radio"
                      name="radioOrderOptions"
                      value="normalOrder"
                      disabled={isActive}
                      checked={orderToShow === "normalOrder"}
                      onChange={handleOrderToShowChange}
                    />
                    {t( "normalOrder.label" )}</label>
                  <label className="form-check-label order-labels" >
                    <input
                      className="form-check-input order-inputs"
                      type="radio"
                      name="radioOrderOptions"
                      value="reverseOrder"
                      disabled={isActive}
                      checked={orderToShow === "reverseOrder"}
                      onChange={handleOrderToShowChange}
                    />
                    {t( "reverseOrder.label" )}</label>
                  <label className="form-check-label order-labels" >
                    <input className="form-check-input order-inputs"
                      type="radio"
                      name="radioOrderOptions"
                      value="randomOrder"
                      disabled={isActive}
                      checked={orderToShow === "randomOrder"}
                      onChange={handleOrderToShowChange}
                    />
                    {t( "randomOrder.label" )}</label>
                </div>
              </div >
            </div >
            {/* Change */}
            <div className="card mx-auto card-style">
              <div className="card-body">
                <h3 className="card-title">{t( "change.label" )}</h3>
                <div className="form-check-inline">
                  <label className="form-check-label change-labels" >
                    <input
                      className="form-check-input change-inputs"
                      type="radio"
                      name="radioChangeOptions"
                      value="manually"
                      disabled={isActive}
                      checked={changeMode === "manually"}
                      onChange={handleChangeModeChange}
                    />
                    {t( "manuallyChange.label" )}</label>
                </div>
                <div className="form-check-inline">
                  <label className="form-check-label change-labels" >
                    <input
                      className="form-check-input change-inputs"
                      type="radio"
                      name="radioChangeOptions"
                      value="automatic"
                      disabled={isActive}
                      checked={changeMode === "automatic"}
                      onChange={handleChangeModeChange}
                    />
                    {t( "automaticChange.label" )}
                  </label>
                  <input
                    className="form-control input-edit "
                    type="text"
                    disabled={changeMode !== "automatic" || isActive}
                    value={changeChordTime}
                    onChange={handleChangeChordTimeChange}
                  />
                </div>
              </div>
            </div>
            {/* Stop */}
            <div className="card mx-auto card-style">
              <div className="card-body">
                <h3 className="card-title">{t( "stop.label" )}</h3>
                <div className="form-check-inline">
                  <label className="form-check-label stop-labels" >
                    <input
                      className="form-check-input stop-inputs"
                      type="radio"
                      name="radioStopOptions"
                      value="manually"
                      disabled={changeMode !== "automatic" || isActive}
                      checked={stopMode === "manually"}
                      onChange={handleStopModeChange}
                    />
                    {t( "manuallyStop.label" )}</label>
                  <label className="form-check-label stop-labels" >
                    <input
                      className="form-check-input stop-inputs"
                      type="radio"
                      name="radioStopOptions"
                      value="afterIterations"
                      disabled={changeMode !== "automatic" || isActive}
                      checked={stopMode === "afterIterations"}
                      onChange={handleStopModeChange}
                    />
                    {t( "afterIterationsStop.label" )}
                  </label>
                  <input
                    className="form-control input-edit"
                    type="text"
                    disabled={stopMode !== "afterIterations"}
                    value={stopVariableIterations}
                    onChange={handleStopIterationsVariableChange}
                  />
                  <label className="form-check-label stop-labels" >
                    <input
                      className="form-check-input stop-inputs"
                      type="radio"
                      name="radioStopOptions"
                      value="afterMinutes"
                      disabled={changeMode !== "automatic" || isActive}
                      checked={stopMode === "afterMinutes"}
                      onChange={handleStopModeChange}
                    />
                    {t( "afterMinutesStop.label" )}
                  </label>
                  <input
                    className="form-control input-edit"
                    type="text"
                    disabled={stopMode !== "afterMinutes" || isActive}
                    value={stopVariableMinutes}
                    onChange={handleStopMinutesVariableChange}
                  />
                </div>
              </div>
            </div>
            <div className="container">
              <button type="button" className="btn btn-primary buttons" onClick={isActive ? stop : start}>{isActive ? t( "stopChords.label" ) : t( "startChords.label" )}</button>
              {chordsToShowVar.length === 0 ? null : <button type="button" className="btn btn-primary buttons" onClick={nextChord} >{t( "nextChord.label" )}</button>}
            </div>
          </div>
          <div className="col align-self-center">
            <h2>{showingChord}</h2>
            <div className="react-card"></div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
