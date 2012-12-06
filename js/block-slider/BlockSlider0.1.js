/*
 *      BLOCK-SLIDER
 *      
 *      JQUERY VER.:    1.2.3
 *      VER:            0.1
 *      AUTHOR:         HUGO ELIAS
 *      NOTES:          See example HTML for configuration.
 *      
 *      **************
 *      data structure
 *      **************
 *      
 *      {
 *          "items": [
 *                      {
 *                          "id": 22,
 *                          "image": "images/01.jpg",
 *                          "link": "http://www.google.com",
 *                          "title": "my content",
 *                          "subtitle": "my subtitle",
 *                          "description": "my description"
 *                      }
 *                  ]
 *      }
 *
 *
 *      **************
 *	markup example
 *	**************
 *	
 *	<!-- main container -->
 *	
 *	<div id="myControl">
 *	
 *          <!-- scroll container -->
 *          
 *          <div class="scroll">
 *          
 *              <!-- dynamic content STARTS HERE! -->
 *              
 *              <div id="set0">
 *                  
 *                  <div id="box0">
 *                  
 *                      <!-- actuall content -->
 *                      
 *                      <div>
 *                      
 *                      <a href="{url}"><img src="{path}" border="0"/></a>
 *                      
 *                      <!-- set text style on span class and block-slider.css -->
 *                      
 *                      <div><span class="someclass">{title}</span></div>
 *                      
 *                      <div><span class="someclass">{subtitle}</span></div>
 *                      
 *                      <div><span class="someclass">{description}</span></div>
 *                      
 *                      </div>
 *                  
 *                  </div>
 *                  
 *              </div>
 *              
 *              <!-- dynamic content ENDS HERE! -->*              
 *          
 *          </div>
 *          
 *      </div>
 *	
 *	
 *
 */

(function($) {

	$.fn.BlockSlider = function(options) {

            // default configuration properties
            var defaults = {
                // data vars
                dataURL:                    null,
                dataVars:                   null,
                // control props in pixels, actual grid elements measures might be determined based on control measures or viceversa --
                buttonShow:                 false,
                buttonNextId:               'btnNextId',
                buttonPrevId:               'btnPrevId',
                buttonNextArt:              null,
                buttonPrevArt:              null, 
                buttonNextLabel:            ' next >',
                buttonPrevLabel:            '< prev ',
                //
                controlWidth:               0,
                controlHeight:              0,
                //
                scrollContainerIdPrefix:    'set',
                scrollSpeed:                100,
                // grid vars                    
                // width & height are in pixels
                gridItemMargin:             0,
                gridItemBorder:             0,
                gridItemPadding:            0,
                gridItemWidth:              100, 
                gridItemHeight:             100,
                imageWidthPercentage:       0.5,
                imageHeightPercentage:      0.5,
                // 
                gridItemIdPrefix:           'box',
                gridMaxRows:                2, 
                gridMaxCols:                2
                //
            };                 
            //
            // extending default options --
            //
            var options = $.extend(defaults, options);
            //
            // assigning reference main control
            //
            var control             = $(this);
            var controlWidth        = (options.gridItemWidth + (options.gridItemMargin*2)) * options.gridMaxCols;
            var controlHeight       = (options.gridItemHeight + (options.gridItemMargin*2)) * options.gridMaxRows;
            var totalPages          = 0;
            var currentPageIndex    = 0;
            //
            // setting control width and height
            //
            $(control)
                .css('width', controlWidth)
                .css('height', controlHeight);
                
            //            
            // if datasource parameter is set, retrieve data --
            //                
            if(options.dataURL != null) {
                //
                $.getJSON(options.dataURL, options.dataVars, function(data) {
                    // receive json object, assign to global variable --
                    var dataSource = (data != null ? data : null);
                    //
                    if(dataSource!=null) {                                        
                        // build the received elements                        
                        var currentRowIndex     = 0;
                        var currentRowItem      = 0;                    
                        //
                        var currentContainer    = null;
                            //
                            $(dataSource.items).each(function(index, element) {
                            //
                            if(currentRowItem >= options.gridMaxRows) {
                                // next row item (col)
                                currentRowItem = 0;
                                currentRowIndex++;
                                //
                            } 
                            //
                            if(currentRowIndex >= options.gridMaxCols) {                                
                                // increase page index
                                currentPageIndex++;
                                currentRowItem = 0;
                                currentRowIndex = 0;
                                currentContainer = null;
                                //
                            }
                            //
                            console.log('container', currentContainer);
                            //
                            if(currentContainer == null) {
                                //
                                var top     = 0;
                                var left    = currentPageIndex * (options.gridItemWidth * options.gridMaxCols);
                                //
                                // by default setting flow from left to right --
                                //
                                var width   = controlWidth;
                                var height  = controlHeight;
                                
                                currentContainer = itemCreate($(".scroll", control), options.scrollContainerIdPrefix + currentPageIndex, top, left, width, height);
                                
                                itemSetVisibility(currentContainer, false);
                                
                            }
                            // construct the data for each element --                                                            
                            var xPos = options.gridItemWidth * currentRowItem;
                            var yPos = options.gridItemHeight * currentRowIndex;
                            //
                            // console.log(index, 'xPos:', xPos, 'yPos', yPos);
                            //
                            currentRowItem++;
                            //                            
                            var item = itemCreate(currentContainer, options.gridItemIdPrefix + index, xPos, yPos, options.gridItemWidth, options.gridItemHeight);
                            //
                            // we should add content here --
                            //
                            itemAddContent(item, element.link, element.image, element.title, element.subtitle, element.description);
                            //
                            });
                        // set scroll element width
                        $(".scroll", control)
                            .css('width',   controlWidth*(currentPageIndex+1))
                            .css('height',  controlHeight);
                        //
                        totalPages = currentPageIndex;
                        currentPageIndex = 0;
                        //
                        itemSetVisibility($('#' + options.scrollContainerIdPrefix + currentPageIndex), true);
                        //
                        // console.log('item', item);
                        //
                        if(options.buttonShow) {
                            //
                            itemAddButtons();
                            //
                        }
                        //
                    }

                });

            }
            
            itemAddButtons = function() {
                
                $(document.createElement("span"))
                    .attr('id', options.buttonPrevId)                    
                    .css('top', 0)
                    .css('left', 0)
                    .css('width', controlWidth/2)
                    .css('height', 20)
                    .css('position', 'relative')
                    .css('background-color', 'red')
                    .css('display', 'block')
                    .css('float', 'left')
                    .html(options.buttonPrevLabel)
                    .click(function(){doScroll(false);})
                    .appendTo(control);
                    
                $(document.createElement("span"))
                    .attr('id', options.buttonNextId)                    
                    .css('top', 0)
                    .css('left', 0)
                    .css('width', controlWidth/2)
                    .css('height', 20)
                    .css('position', 'relative')
                    .css('background-color', 'blue')
                    .css('display', 'block')
                    .css('float', 'right')
                    .html(options.buttonNextLabel)
                    .click(function(){doScroll(true);})
                    .appendTo(control);

            }

            itemCreate = function(parent, id, top, left, width, height, content) {
                
                return $(document.createElement("div"))
                    .attr('id', id)
                    .css('width', width)
                    .css('height', height)
                    // this suckers where actually not working as expected!!
                    //.css('top', top)
                    //.css('left', left)                    
                    .css('position', 'relative')
                    .css('display', 'block')
                    .css('float', 'left')
                    .appendTo(parent);
            }            
            
            itemAddContent = function(item, href, image, title, subtitle, description) {
                // content base div --
                var content = '<div class="contentBox" style="width:' + options.gridItemWidth + 'px;height:' + options.gridItemHeight + 'px;padding-top:10px;"><a class="contentLink" href="{href}" border="0"><img class="contentImage" src="{image}" width="{imageWidth}" height="{imageHeight}" border="0"/></a><div class="contentTitle">{title}</div><div class="contentSubtitle">{subtitle}</div><div class="contentDescription">{description}</div></div>';
                // actual link
                content = content.replace('{href}',         href);
                //
                content = content.replace('{image}',        image);
                content = content.replace('{imageWidth}',   options.gridItemWidth * options.imageWidthPercentage);
                content = content.replace('{imageHeight}',  options.gridItemHeight * options.imageHeightPercentage);
                //
                content = content.replace('{title}',        title);
                content = content.replace('{subtitle}',     subtitle);
                content = content.replace('{description}',  description);
                //
                $(item).html(content);
                //
            }
            
            itemSetVisibility = function(item, isVisible) {
                //
                if(isVisible) {
                    $(item).css('visibility', 'visible');
                } else {
                    $(item).css('visibility', 'hidden');
                }                
                //
            }
            
            /*
            itemClick = function(item, action, target ) {
                
            }
            */

            /*
             * supports only horizontal scrolling for now, true == next, false == prev
             */
            doScroll = function(goForward) {
                //
                // first set invisible the current item
                itemSetVisibility($('#' + options.scrollContainerIdPrefix + currentPageIndex), false);
                //
                var step        = options.gridItemWidth * options.gridMaxCols;
                //
                // go to the right--
                //
                if(!goForward) {                               
                    //
                    if(currentPageIndex > 0) {
                        //
                        currentPageIndex = currentPageIndex - 1;
                        //
                    } else {
                        //
                        currentPageIndex = 0;
                        //
                    }
                    //
                } else 
                //
                // or to the other right--
                //
                if(goForward) {
                    //
                    if(currentPageIndex < totalPages) {
                        //
                        currentPageIndex = currentPageIndex + 1;
                        //
                    } else {
                        //
                        currentPageIndex = totalPages;
                        //
                    }
                    //
                }
                //
                $(".scroll", control).animate({marginLeft:-(currentPageIndex*step)},{queue:false, duration:50});
                //
                // set new current as visible
                //
                itemSetVisibility($('#' + options.scrollContainerIdPrefix + currentPageIndex), true);
            }
            //                
        }
        //
    //
})(jQuery);
