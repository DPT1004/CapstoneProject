import React from "react"
import Slider from 'rn-range-slider'
import Thumb from './components/Thumb'
import Rail from './components/Rail'
import RailSelected from './components/RailSelected'
import Notch from './components/Notch'
import Label from './components/Label'

const RangeSlide = ({ duration, handleSliderTouchEnd, low, high }) => {

    const renderThumb = React.useCallback(() => <Thumb />, []);
    const renderRail = React.useCallback(() => <Rail />, []);
    const renderRailSelected = React.useCallback(() => <RailSelected />, []);
    const renderLabel = React.useCallback(value => <Label text={Number(value).toFixed(1) + "s"} />, []);
    const renderNotch = React.useCallback(() => <Notch />, []);

    if (duration !== 0) {
        return (
            <Slider
                min={0}
                max={duration}
                floatingLabel
                step={1}
                minRange={5}
                low={low}
                high={high}
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onSliderTouchEnd={handleSliderTouchEnd}
            />
        )
    } else {
        return (<></>)
    }
}
export default RangeSlide