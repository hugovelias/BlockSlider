/*
 *	markup example for $("#slider").easySlider();
 *	
 * 	<div id="slider">
 *		<ul>
 *			<li><img src="images/01.jpg" alt="" /></li>
 *			<li><img src="images/02.jpg" alt="" /></li>
 *			<li><img src="images/03.jpg" alt="" /></li>
 *			<li><img src="images/04.jpg" alt="" /></li>
 *			<li><img src="images/05.jpg" alt="" /></li>
 *		</ul>
 *	</div>
 *
 */

(function($) {

	$.fn.exampleSlider = function(options) {

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
                scrollContainerIdPrefix:     'set',
                scrollSpeed:                100,
                // grid vars                    
                // width & height are in pixels
                gridItemMargin:             0,
                gridItemBorder:             0,
                gridItemPadding:            0,
                gridItemWidth:              100, 
                gridItemHeight:             100,
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
            var totalPages          = 0;
            var currentPageIndex    = 0;
            //
            // setting control width and height
            //
            $(control)
                .css('height', (options.gridItemHeight + (options.gridItemMargin*2)) * options.gridMaxRows)
                .css('width', (options.gridItemWidth + (options.gridItemMargin*2)) * options.gridMaxCols);
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
                                var width   = (options.gridItemWidth + (options.gridItemMargin*2)) * options.gridMaxCols;
                                var height  = (options.gridItemHeight + (options.gridItemMargin*2)) * options.gridMaxRows;
                                
                                currentContainer = itemCreate($(".scroll", control), options.scrollContainerIdPrefix + currentPageIndex, top, left, width, height);
                                
                            }
                            // construct the data for each element --                                                            
                            var xPos = options.gridItemWidth * currentRowItem;
                            var yPos = options.gridItemHeight * currentRowIndex;
                            //
                            console.log(index, 'xPos:', xPos, 'yPos', yPos);
                            //
                            currentRowItem++;
                            //                            
                            item = itemCreate(currentContainer, options.gridItemIdPrefix + index, xPos, yPos, options.gridItemWidth, options.gridItemHeight);
                            //
                            // we should add content here --
                            //
                            itemAddContent(item,'http://www.google.com',null,'item-' + index,'content-' + index, 'description-' + index);
                            //
                            });
                        // set scroll element width
                        $(".scroll", control)
                            .css('width',   (((options.gridItemWidth + (options.gridItemMargin*2)) *options.gridMaxCols)*(currentPageIndex+1)))
                            .css('height',  ((options.gridItemHeight+ (options.gridItemMargin*2))*options.gridMaxRows));
                        //
                        totalPages = currentPageIndex;
                        currentPageIndex = 0;
                        //
                        // create controls.
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
                //
                // var buttonPrev = '<span id="'+ options.buttonPrevId +'"><a href=\"javascript:void(0);\">'+ options.buttonPrevLabel +'</a></span>';
                // var buttonNext = '<span id="'+ options.buttonNextId +'"><a href=\"javascript:void(0);\">'+ options.buttonNextLabel +'</a></span>';

                $(document.createElement("span"))
                    .attr('id', options.buttonPrevId)                    
                    .css('top', 0)
                    .css('left', 0)
                    .css('width', 120)
                    .css('height', 20)
                    .css('position', 'relative')
                    .css('background-color', 'red')
                    .css('display', 'block')
                    .css('float', 'left')
                    .html(options.buttonPrevLabel)
                    .click(function(){doScroll('PREV');})
                    .appendTo(control);
                    
                $(document.createElement("span"))
                    .attr('id', options.buttonNextId)                    
                    .css('top', 0)
                    .css('left', 0)
                    .css('width', 120)
                    .css('height', 20)
                    .css('position', 'relative')
                    .css('background-color', 'blue')
                    .css('display', 'block')
                    .css('float', 'right')
                    .html(options.buttonNextLabel)
                    .click(function(){doScroll('NEXT');})
                    .appendTo(control);

                /*
                $(control).after(buttonPrev, buttonNext);
                //
                // hint: must add dynamic html to control before assigning events or they wont work --
                $('#' + options.buttonPrevId).css('top',0).css('left',10);
                */
                
                /*
                //
                $("a","#" + options.buttonPrevId).click(function(){
                        doScroll("PREV");
                });
                //
                $("a","#" + options.buttonNextId).click(function(){
                        doScroll("NEXT");
                });    
                //
                */
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
                var content = '<div style="width:' + options.gridItemWidth + 'px;height:' + options.gridItemHeight + 'px;padding-top:10px;"><a href="{href}" border="0"><img src="{image}" border="0"/></a><div>{title}</div><div>{subtitle}</div><div>{description}</div></div>';
                // actual link
                content = content.replace('{href}',         href);
                //
                content = content.replace('{image}',        image);
                content = content.replace('{title}',        title);
                content = content.replace('{subtitle}',     subtitle);
                content = content.replace('{description}',  description);
                //
                $(item).html(content);
                //
            }
            
            /*
            itemClick = function(item, action, target ) {
                
            }
            */

            /*
             * supports only horizontal scrolling --
             */
            doScroll = function(direction) {
                //
                var step        = options.gridItemWidth * options.gridMaxCols;
                /*
                var pageIndex   = currentPageIndex;
                var diff        = Math.abs(totalPages-pageIndex);
                var speed       = diff * options.scrollSpeed;
                //
                
                //
                var newMargin   = pageIndex * step;
                */
                //                
                // console.log(pageIndex, totalPages, diff, speed, step, newMargin);
                //
                
                // go to the right--
                //
                if(direction == "PREV") {                               
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
                if(direction == "NEXT") {
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
                $(".scroll", control).animate({marginLeft:-(currentPageIndex*step)},{queue:false, duration:100});
            }
            //                
        }
//
})(jQuery);
