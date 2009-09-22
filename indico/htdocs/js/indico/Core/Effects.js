/**
     @namespace Simple effects
    */

IndicoUI.Effect = {

    disable: function(element){
        element.each(function(elem) {
            if (exists(element.dom.disabled)) {
                element.dom.disabled = true;
            }
            element.dom.style.color = 'gray';
            IndicoUI.Effect.disable(elem);
        });
    },

    frame: function(element){
        element.setStyle('overflow', 'auto');
        element.setStyle('border', '1px solid red');
    },

    /**
        * Simple CSS manipulation that sets the element's 'display' property to a new style
        * @param {XElement} element the target element
        * @param {string} newStyle the new display style, e.g.: "inline", "block", "table-row".
        *                 If not existant, will be set to '', which usually restores the default style of the element.
        */
    appear: function(element, newStyle){
        if (!exists(newStyle)) {
            newStyle = '';
        }
        element.dom.style.display = newStyle;
    },

    /**
        * Simple CSS manipualtion that sets the element's
        * 'display' property to 'none'
        * @param {XElement} element the target element
        */
    disappear: function(element){
        element.dom.style.display = 'none';
    },
    
    /**
     * Simple CSS manipualtion that shows or hides the element by changing its 'display' property
     * @param {XElement} element the target element
     */
    toggleAppearance: function(element, newStyle){
        if (element.dom.style.display == 'none') {
            IndicoUI.Effect.appear(element, newStyle);
        } else {
            IndicoUI.Effect.disappear(element, newStyle);
        }
    },

    /**
        * Simple CSS manipulation that sets the element
        * to a different background when the mouse is
        * over it
        * @param {XElement} element the target element
        */
    mouseOver: function(element){
        element.onmouseover = function(){
            this.style.background = "#FFF6DF";
        };
        element.onmouseout = function(){
            this.style.background = "transparent";
        };
    },

    /**
     * Turns an element into a given color, optionally reverting it to its default color after a given time.
     * @param {string} elementId The id of the element to highlight.
     * @param {string} color The color to be used.
     * @param {number} time A number in milliseconds after which the element will come back to its default color.
     */
    highLight: function(elementId, color, time) {
        $E(elementId).dom.style.color = color;
        if (time) {
            setTimeout("IndicoUI.Effect.removeHighLight('" + elementId +"')", time);
        }
    },

    /**
     * Utility function used by highLight to remove the highlight safely (the element may have disappeared during the timeout)
     */
    removeHighLight: function(elementId) {
        element = $E(elementId);
        if (exists(element)) {
            element.dom.style.color = '';
        }
    },

    /**
     * Turns the background of an element into a given color, optionally reverting it to its default color after a given time.
     * @param {string} elementId The id of the element to highlight.
     * @param {string} color The color to be used for the background.
     * @param {number} time A number in milliseconds after which the element will come back to its default color.
     */
    highLightBackground: function(elementId, color, time) {
        if (!exists(color)) {
            color = "#FFFF88" //light yellow
        }
        if (!exists(time)) {
            time = 3000; //3 seconds
        }

        $E(elementId).dom.style.backgroundColor = color;

        if (time) {
            setTimeout("IndicoUI.Effect.removeHighlightBackground('" + elementId +"')", time);
        }
    },

    /**
     * Utility function used by highLightBackground to remove the highlight safely (the element may have disappeared during the timeout)
     */
    removeHighlightBackground: function(elementId) {
        element = $E(elementId);
        if (exists(element)) {
            element.dom.style.backgroundColor = '';
        }
    },
    
    fade: function(eid, TimeToFade) {
        if (!exists(TimeToFade))
            TimeToFade = 500.0
        var element = document.getElementById(eid);
        if(element == null)
            return;

        if(element.FadeState == null) {
            if(element.style.opacity == null || element.style.opacity == ''
                                             || element.style.opacity == '1') {
                element.FadeState = 2;
            }
            else {
                element.FadeState = -2;
            }
        }
        
        if(element.FadeState == 1 || element.FadeState == -1) {
            element.FadeState = element.FadeState == 1 ? -1 : 1;
            element.FadeTimeLeft = TimeToFade - element.FadeTimeLeft;
        }
        else {
            element.FadeState = element.FadeState == 2 ? -1 : 1;
            element.FadeTimeLeft = TimeToFade;
            setTimeout(function() {animateFade(new Date().getTime(), eid);}, 33);
        }
      
        animateFade = function(lastTick, eid) {  
            var curTick = new Date().getTime();
            var elapsedTicks = curTick - lastTick;
        
            var element = document.getElementById(eid);
        
            if(element.FadeTimeLeft <= elapsedTicks) {
                element.style.opacity = element.FadeState == 1 ? '1' : '0';
                element.style.filter = 'alpha(opacity = ' + (element.FadeState == 1 ? '100' : '0') + ')';
                if (element.FadeState == 1) {
                    element.style.filter = null;
                }
                element.FadeState = element.FadeState == 1 ? 2 : -2;
                return;
            }
        
            element.FadeTimeLeft -= elapsedTicks;
            var newOpVal = element.FadeTimeLeft/TimeToFade;
            if(element.FadeState == 1)
                newOpVal = 1 - newOpVal;
        
            element.style.opacity = newOpVal;
            element.style.filter = 'alpha(opacity = ' + (newOpVal*100) + ')';
        
            setTimeout("animateFade(" + curTick + ",'" + eid + "')", 33);
        };
    },

    Draggable: function(elem, handle, downHandler, upHandler) {

        var stopObsMouseDown =

        handle.observeEvent(
            'mousedown',
            function(event) {

                var getScrollX = function() {
                    if (exists(window.scrollX)) {
                        return window.scrollX;
                    } else {
                        return document.documentElement.scrollLeft;
                    }
                };

                var getScrollY = function() {
                    if (exists(window.scrollY)) {
                        return window.scrollY;
                    } else {
                        return document.documentElement.scrollTop;
                    }

                };

                var stopObsMouseMove =
                    $E(document).observeEvent(
                        'mousemove',
                        function(event) {

                            var diffX = event.clientX + getScrollX() - startX;
                            var diffY = event.clientY + getScrollY() - startY;

                            elem.dom.style.top = diffY+"px";
                            elem.dom.style.left = diffX+"px";

                            event.preventDefault();
                        });

                var stopObsMouseUp =
                    $E(document).observeEvent(
                        'mouseup',
                        function(event) {

                            stopObsMouseMove();
                            stopObsMouseUp();

                            if (exists(upHandler)) {
                                upHandler();
                            }
                            event.preventDefault();
                        });

                var startX = event.clientX + getScrollX() - getPx(elem.dom.style.left);
                var startY = event.clientY + getScrollY() - getPx(elem.dom.style.top);

                if (exists(downHandler)) {
                    downHandler();
                }
                event.preventDefault();
            });

        return elem;
    },
    
    /**
     * Prepares an element to be shown / hidden with the 'slide' function.
     * If you want the element to be initially hidden, its html should be like this:
     * <div id="myElem" style="visibility: hidden; overflow: hidden;">...</div>
     * 
     * @param {string} elemId ID of the element
     * @param {boolean} initiallyHidden true if you want to initially hide the element, false otherwise.
     * @return {number} the measured height of the element that has to be input to the 'slide' function.
     */
    prepareForSlide: function(elemId, initiallyHidden) {
        var elem = $E(elemId);
        var height = elem.dom.offsetHeight;
        if (initiallyHidden) {
            elem.dom.style.height = '0';
            elem.dom.style.opacity = "0";
        }
        return height;
    },
    
    slide: function(elemId, elemHeight, showHook, hideHook) {
        
        /**
         * 
         * Before using this Effect your 'elem' should be initialize.
         * 1) If you want that the element is hidden at the beginning (on load), then:  
         * 
         *      a)
         * 
         *          <div id="myElem" style="visibility: hidden; overflow: hidden;">...</div>
         *      b)
         *          $E(myElem).dom.style.height = '0';
         *          $E(myElem).dom.style.opacity = "0";
         *          
         *          
         * 2) If you want that the element is visible at the beginning  (on load):
         * 
         *      a)
         * 
         *          <div id="myElem">...</div>
         *      b) 
         *          Nothing to do.
         *          
         *          
         * @param elemId ID of the element
         * @param elemHeight $(elemId).dom.offsetHeight; The elem should be visible or 
         * hidden in order to get the offsetHeight, but not display: none.
         * 
         * Also, be careful that in the moment that you measure the height, the element that
         * you are measuring has been completely rendered by a browser. For example,
         * IE7 does not render a table until the </table> closing tag, but FF3 renders it before.
         * You can check if the measure was correct by launching an "alert(height)" after the measure
         * and if the measured height is 0 and the measured element is not rendered yet, you
         * have to put the Javascript code measuring the height later in the DOM tree. 
         * 
         */
        var elem = $E(elemId);
        elem.dom.style.overflow = 'hidden';
        var elemDivHeight = elemHeight;
        
        if (parseInt(elem.dom.style.height) == '0') {
            elem.dom.style.visibility = 'visible';
            var heightCounter = 1;
            IndicoUI.Effect.fade(elemId, (Math.floor(Math.log(elemDivHeight)/Math.log(1.3))*20)+200);
            var incHeight = function() {
                heightCounter *= 1.3;
                if (heightCounter < elemDivHeight) {
                    elem.dom.style.height = Math.floor(heightCounter)+'px';
                    setTimeout(function(){incHeight();}, 20);
                } else {
                    elem.dom.style.height = "auto";
                    if (exists(showHook)) showHook();
                }
            };
            setTimeout(function(){incHeight();}, 20);
            
        } else {
            var heightCounter = elemDivHeight;
            IndicoUI.Effect.fade(elemId, (Math.floor(Math.log(elemDivHeight)/Math.log(1.3))*20));
            var decHeight = function() {
                heightCounter /= 1.3;
                if (heightCounter > 5) {
                    elem.dom.style.height = Math.floor(heightCounter)+'px';
                    setTimeout(function(){decHeight();}, 20);
                } else {
                    elem.dom.style.height = '0px';
                    elem.dom.style.visibility = 'hidden';
                    if (exists(hideHook)) hideHook();
                }
            };
            setTimeout(function(){decHeight();}, 20); 
        }
        
    }


};

