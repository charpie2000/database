function ButtonTrackingObj(exp, titleName, cm, frame){
   this.VarTrivBtnTracking = new Variable( 'VarTrivBtnTracking', null, 0, cm, frame, exp, titleName, true );
   this.title = null;
}

ButtonTrackingObj.codeToStateMap =
{
	'N' : 'normalState',
	'O' : 'overState',
	'D' : 'downState',
	'A' : 'disabledState',
	'V' : 'visitedState',
	'S' : 'selectedState'
};
ButtonTrackingObj.stateToCodeMap = {};
for (var key in ButtonTrackingObj.codeToStateMap)
	ButtonTrackingObj.stateToCodeMap[ButtonTrackingObj.codeToStateMap[key]] = key;

ButtonTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivBtnTracking.getValue();
	var bDoInit = true;
	try {
	    if (pageTrackData && pageTrackData.length > 0 && pageTrackData != '~~~null~~~')
	    {
	        var topLevelSplit = pageTrackData.split('#');
	        if (topLevelSplit && topLevelSplit.length > 1)
            {
		        var arrIds = topLevelSplit[0].split(',');
		        var arrStatus = topLevelSplit[1].split(',');
		        for( var i=0; i<arrIds.length; i++ )
		        {
			        var id = parseInt( '0x' + arrIds[i] );
			        var status = arrStatus[i];
			        var node = this.FindNode( this.title, id );
			        if( node )
						node.v = ButtonTrackingObj.codeToStateMap[status] || status;
		        }
    		}
        }
    } catch (e) { }
}

ButtonTrackingObj.prototype.FindNode = function( node, id )
{
	if( node.id == id )
		return node;
	
	var match = null;
	if( typeof( node.c ) != 'undefined' ){
		for( var i=0; i<node.c.length; i++ ){
			match = this.FindNode( node.c[i], id );
			if( match != null )
				break;
		}
	}
	
	return match;
}

ButtonTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		return 'normalState';
	}
}


ButtonTrackingObj.prototype.GetRangeStatus = function( id, bInit )
{
	var status = -1;
	if ( bInit ) 
		this.InitPageTracking();
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );

	return status;
}


ButtonTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
{
	if( node == null )
		return;
	node.v = status;
	if( status == 0 && typeof(node.c)!='undefined')
	{
		for( var i=0; i<node.c.length; i++ )
			this.InternalSetRangeStatus( node.c[i], status ); 
	}
}

ButtonTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

ButtonTrackingObj.prototype.IterateTree = function( func )
{
	var stack = [];
	stack.push( this.title );
	var i = 0;
	while( stack.length > 0 )
	{
		var node = stack.shift();
		
		if( typeof(node.c) != 'undefined' )
			stack = node.c.concat(stack);
			
		//do the thing
		func( node, i, stack );
		i++;
	}	
}

ButtonTrackingObj.prototype.SavePageTracking = function()
{
	var fnIsSaveState = window.ObjButton && ObjButton.isSaveState || function () { return false; };
	var hexString = '';
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree(function(node, i, stack){
		if (fnIsSaveState(node.v))
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
		hexString += (i > 0 ? ',' : '') + arrayIds[i].toString(16);

	hexString += (arrayIds.length > 0 ? '#' : '');
	
	for (var i = 0; i < arrayStatus.length; i++)
		hexString += (i > 0 ? ',' : '') + (ButtonTrackingObj.stateToCodeMap[arrayStatus[i]] || arrayStatus[i]);

	//LD-8267 - Added a condition to avoid tracking null/empty data unnecessarily
	if (hexString.length > 0 || (myTop.suspendDataCache && myTop.suspendDataCache.indexOf('VarTrivBtnTracking') >= 0) || !this.VarTrivBtnTracking.bSCORM)
		this.VarTrivBtnTracking.set(hexString);
}

var trivBtnTracking = new ButtonTrackingObj(365,'module_2', 0, null);
trivBtnTracking.title={id:1,v:0,c:[{id:332855,v:'normalState'},{id:332848,v:'normalState'},{id:332838,v:'normalState'},{id:332829,v:'normalState'},{id:332822,v:'normalState'},{id:332815,v:'normalState'},{id:332806,v:'normalState'},{id:332796,v:'normalState'},{id:332786,v:'normalState'},{id:332778,v:'normalState'},{id:329143,v:'normalState'},{id:329151,v:'normalState'},{id:330304,v:'normalState'},{id:2322,v:'normalState'},{id:257396,v:'normalState'},{id:257182,v:'normalState'},{id:257824,v:'normalState'},{id:258237,v:'normalState'},{id:258658,v:'normalState'},{id:259129,v:'normalState'},{id:259448,v:'normalState'},{id:259724,v:'normalState'},{id:347738,v:'normalState'},{id:347746,v:'normalState'},{id:304833,v:'normalState'},{id:304850,v:'normalState'},{id:304867,v:'normalState'},{id:304884,v:'normalState'},{id:317002,v:'normalState'},{id:317029,v:'normalState'},{id:317052,v:'normalState'},{id:317065,v:'normalState'},{id:317092,v:'normalState'},{id:317111,v:'normalState'},{id:349296,v:'normalState'},{id:349288,v:'normalState'},{id:217721,v:'normalState'},{id:283712,v:'normalState'},{id:284932,v:'normalState'},{id:285045,v:'normalState'},{id:285271,v:'normalState'},{id:285384,v:'normalState'},{id:284819,v:'normalState'},{id:285158,v:'normalState'},{id:178308,v:'normalState'},{id:178487,v:'normalState'},{id:178604,v:'normalState'},{id:178721,v:'normalState'},{id:178838,v:'normalState'},{id:178955,v:'normalState'},{id:179072,v:'normalState'},{id:317756,v:'normalState'},{id:317783,v:'normalState'},{id:317802,v:'normalState'},{id:318199,v:'normalState'},{id:318226,v:'normalState'},{id:318249,v:'normalState'},{id:318845,v:'normalState'},{id:318872,v:'normalState'},{id:318891,v:'normalState'},{id:319220,v:'normalState'},{id:319247,v:'normalState'},{id:319266,v:'normalState'},{id:337823,v:'normalState'},{id:340398,v:'normalState'},{id:340856,v:'normalState'},{id:342602,v:'normalState'},{id:334594,v:'normalState'},{id:336035,v:'normalState'},{id:222903,v:'normalState'},{id:277726,v:'normalState'},{id:277838,v:'normalState'},{id:224390,v:'normalState'},{id:224404,v:'normalState'},{id:224360,v:'normalState'},{id:224374,v:'normalState'},{id:224330,v:'normalState'},{id:224344,v:'normalState'},{id:224300,v:'normalState'},{id:224314,v:'normalState'},{id:224270,v:'normalState'},{id:224284,v:'normalState'},{id:224240,v:'normalState'},{id:224254,v:'normalState'},{id:281710,v:'normalState'},{id:281703,v:'normalState'},{id:281696,v:'normalState'},{id:282363,v:'normalState'},{id:282371,v:'normalState'},{id:282379,v:'normalState'},{id:282605,v:'normalState'},{id:282613,v:'normalState'},{id:282621,v:'normalState'},{id:282841,v:'normalState'},{id:282849,v:'normalState'},{id:282857,v:'normalState'},{id:283073,v:'normalState'},{id:283081,v:'normalState'},{id:283089,v:'normalState'},{id:283315,v:'normalState'},{id:283323,v:'normalState'},{id:329355,v:'normalState'},{id:329363,v:'normalState'}]};
