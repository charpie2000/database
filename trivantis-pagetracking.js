function PageTrackingObj(exp, titleName, cm, frame){
   this.VarTrivPageTracking = new Variable( 'VarTrivPageTracking', null, 0, cm, frame, exp, titleName, true );
   this.numPages = 0;
   this.publishTimeStamp = 0;
   this.title = null;
}

PageTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivPageTracking.getValue();
	var bDoInit = true;
	try {
	    if (pageTrackData && pageTrackData.length > 0 && pageTrackData != '~~~null~~~')
	    {
	        var topLevelSplit = pageTrackData.split('#');
	        if (topLevelSplit && topLevelSplit.length > 1)
            {
		        var arrIds = topLevelSplit[0].split(',');
		        var arrStatus = topLevelSplit[1].split('');
		        var bits = 4;
		        for( var i=0; i<arrIds.length; i++ )
		        {
			        var id = parseInt( '0x' + arrIds[i] );
			        var mask = 1<<(i%bits);
			        var status = ( parseInt('0x'+arrStatus[Math.floor(i/bits)] ) & mask ) == 0 ? 1 : 2;
			        var node = this.FindNode( this.title, id );
			        if( node )
				        node.v = status;
		        }
    		}
        }
    } catch (e) { }
}

PageTrackingObj.prototype.FindNode = function( node, id )
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

PageTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		// we need to calculate
		if( node.v == 0 )
		{
			var bAllComplete = true;
			var bInprogress = false;
			for( var i=0; i<node.c.length; i++ )
			{
				var cnode = node.c[i];
				var status = this.InternalGetRangeStatus( cnode );
				if( status == 1 || status == 2 )
					bInprogress = true;
				if( status == 0 || status == 1)
					bAllComplete = false;
			}
			
			if( !node.t && bAllComplete )
				return 2;
			else if( bInprogress )
				return 1;
			else
				return 0;
		}
		else
			return node.v
			
	}
}

//returns a incomplete or inprogress or complete
PageTrackingObj.prototype.GetRangeStatus = function( id, bInit )
{
	var status = -1;
	if ( bInit ) 
		this.InitPageTracking();
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );
		
	if( status == 0)
		return 'notstarted';	
	else if( status == 1 )
		return 'inprogress';
		
	return 'complete';
}


PageTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
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

PageTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

PageTrackingObj.prototype.IterateTree = function( func )
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

PageTrackingObj.prototype.SavePageTracking = function()
{
	var hexVal = 0;
	var hexString = '';
	
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree( function(node, i, stack){
		if( node.v != 0 )
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
	{
		if( i!=0 ) hexString += ',';
		hexString += arrayIds[i].toString(16);
	}
	
	hexString += '#';
	
	var bits = 4;
	var num = 0;
	for( var i=0; i<arrayStatus.length; i++ )
	{
		var bit = arrayStatus[i] == 2 ? 1 : 0
		num |= bit << (i%bits);
		if( ((i+1)%bits==0) || ((i+1)==arrayStatus.length) )
		{
			hexString += num.toString(16);
			num = 0;
		}
	}
	
	this.VarTrivPageTracking.set(hexString);
}

PageTrackingObj.prototype.GetNumCompPages = function(childArray, countCompleted)
{
	//Pass in title.c to get all completed pages
	for(var idx = 0; idx < childArray.length; idx++ )
	{
		if(childArray[idx].c)
			countCompleted = this.GetNumCompPages(childArray[idx].c, countCompleted);
		else if( typeof(childArray[idx].c) == 'undefined')
		{
			var strStatus ='';
			strStatus = this.GetRangeStatus(childArray[idx].id);
			if (strStatus === 'complete')
				countCompleted++;
		}
	}
	return countCompleted;
}

var trivPageTracking = new PageTrackingObj(365,'module_2', 0, null);
trivPageTracking.numPages = 41;

trivPageTracking.publishTimeStamp = 2024711710;

trivPageTracking.title={id:1,v:0,c:[{id:300200,v:0,c:[{id:59458,v:0,c:[{id:59462,v:0,c:[{id:1544,v:0},{id:151393,v:0},{id:1545,v:0},{id:1546,v:0}]},{id:59466,v:0,c:[{id:3256,v:0},{id:3271,v:0},{id:3272,v:0},{id:154810,v:0},{id:304806,v:0},{id:316989,v:0},{id:317054,v:0}]},{id:59468,v:0,c:[{id:157275,v:0},{id:319871,v:0,c:[{id:157406,v:0}]},{id:317745,v:0}]},{id:152737,v:0,c:[{id:152738,v:0},{id:158754,v:0}]},{id:152741,v:0,c:[{id:152742,v:0},{id:318186,v:0},{id:159955,v:0},{id:318834,v:0}]},{id:152743,v:0,c:[{id:152744,v:0},{id:194694,v:0},{id:194696,v:0},{id:194697,v:0},{id:344195,v:0,c:[{id:194698,v:0},{id:344197,v:0},{id:344268,v:0},{id:344339,v:0},{id:344410,v:0},{id:344481,v:0},{id:344552,v:0}]},{id:319209,v:0}]},{id:152745,v:0,c:[{id:223416,v:0},{id:199123,v:0},{id:152746,v:0},{id:199479,v:0},{id:199629,v:0},{id:199745,v:0},{id:199774,v:0},{id:199803,v:0}]},{id:328439,v:0,c:[{id:329326,v:0}]}]}]}]};
