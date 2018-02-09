<script>
function object_wanipv6_addr(ulla,addr,prefixlen,gateway){
	this.ulla = ulla;
	this.addr = addr;
	this.prefixlen = prefixlen;
	this.gateway = gateway;
}

function  creat_wanipv6(){
	var lists=new Array();
    for (var i=0;i<datalist_wanipv6.length;i++)
    {
        lists[lists.length]=new object_wanipv6_addr(datalist_wanipv6[i][0],datalist_wanipv6[i][1],datalist_wanipv6[i][2],datalist_wanipv6[i][3]);
    }
    return lists;
}

function uiDoOnLoad()
{
	var f = document.getElementById("frm");
	var url = location.search;
	var tmp = parseInt("<?echo($(connow))?>");
	if("<?echo($(connow))?>" != "")
	{
		if(dataipv6[tmp])
		{
		var tmp_mode = dataipv6[tmp].mode;
		f.ipv6enable.checked = (dataipv6[tmp].active == "1" ? true : false);
		//f.conn_type[2].selected = true;
		//f.inf_name[tmp].selected = true;
		}
		DisplayHide("show_iana_enable");
		DisplayHide("show_iapd_enable");
		DisplayHide("show_hint_enable");
		DisplayHide("show_hint_iapd");
		/*control iana sending. VINCENT W.*/
		if(dataipv6_wan[tmp])
		{
		f.ipv6addr.value = dataipv6_wan[tmp].addr;
		f.prefixlength.value = dataipv6_wan[tmp].prefixlen;
		f.gateway.value = dataipv6_wan[tmp].gateway;
		f.pridns.value = dataipv6_dns[tmp].entry;
		f.secdns.value = dataipv6_dns[tmp].entry2;
		if(dataipv6_wan[tmp].ulla == "1")
			f.enblinkloc.checked = true;
		else
			f.enblinkloc.checked = false;
		}
		if(wanipv6status[tmp])
		{
		if(f.ipv6addr.value == "" && wanipv6status[tmp].ipaddr != "")
			f.ipv6addr.value = wanipv6status[tmp].ipaddr;	
		if(f.gateway.value == "" && wanipv6status[tmp].gateway != "")
			f.gateway.value = wanipv6status[tmp].gateway;
		if(f.pridns.value == "" && wanipv6status[tmp].dns1 != "")
			f.pridns.value = wanipv6status[tmp].dns1;
		if(f.secdns.value == "" && wanipv6status[tmp].dns2 != "")
			f.secdns.value = wanipv6status[tmp].dns2;
		}
		f.inf_name.value = tmp;
	}
	else
	{
		f.inf_name.value = "";
	}
	f.conn_type.value = "STATIC";
	uiDoOnLoad_Comm();
	if(document.getElementById("show_dhcppd"))
	{
		DisplayHide("show_dhcppd");
	}
	enable_linklocaddr();	
}

function doSubmit(){
	var f = document.getElementById("frm");
	var idx = f.inf_name.value;
	if(idx != "")
	{
	var str=new String("");
	str += "sp_ipv6_staticipv6.xgi?connow="+idx+"&";

	if (checkdParameter()==false|| checkDNSParameter()==false ||check_lanipv6_cfg()==false)
   	 	return;
	if(physical_type == '0')
		str+="setPath=/ipv6/dsl:"+(parseInt(idx)+1)+"/";
	else
		str+="setPath=/ipv6/eth:"+(parseInt(idx)+1)+"/";
	
	str +="&mode="+f.conn_type.value;
	str +="&enable="+(f.ipv6enable.checked ? "1" : "0");
	str +="&dhcpv6_iana_enable=0";
	str +="&dhcpv6_iapd_enable=0";
	str +="&hint_enable=0";
	str +="&hint_iapd=";
	str +="&hint_iapd_length=";
	//str +="&dhcpv6opt=IA-PD";
	if(f.enblinkloc.checked)		
		str +="&ulla=1";
	else
	{
		str +="&ulla=0";
		str +="&addr="+f.ipv6addr.value;
		str +="&prefixlen="+f.prefixlength.value;
	}
	str +="&gateway="+f.gateway.value;
	//str +="&dns/mode=1";
	str +="&dns/entry="+f.pridns.value;
	str +="&dns/entry2="+f.secdns.value;
	str +="&endSetPath=1";
	str += ipv6lanside_submit();
	if(f.ipv6enable.checked == false)
	{
		/*if ipv6 disabled, the mode can't be "only ipv6". added by VINCENT W.*/
		str+="&"+"set/wan/dsl/inf:1/vlanmux/entry:"+(parseInt(idx))+"/only_ipv6=0";
	}
	str+="&CMT=0";
	/*I think this part of "if" make no sense. modified by VINCENT W.*/
	if(parseInt(idx) != 1)
		if((f.ipv6enable.checked == false && dataipv6[idx].active == "1") || (f.ipv6enable.checked == true && dataipv6[idx].active == "0"))
			str+="&"+"EXE=wan,1,1";
	str+="&"+"EXE=wan,1," + parseInt(idx);
	//str+="&"+"EXE=ipv6,restart,"+(parseInt(idx)+1);
	self.location.href = str;
	}
	else
	{
		alert(m_ipv6_no_default_route);
	}
}
function enable_linklocaddr()
{
	var f = document.getElementById("frm");
	if(f.enblinkloc.checked)
	{
		f.enblinkloc.checked = true;
		f.ipv6addr.disabled = true;
		f.prefixlength.disabled = true;
	}
	else
	{
		f.enblinkloc.checked = false;
		f.ipv6addr.disabled = false;
		f.prefixlength.disabled = false;
	}
}

function checkdParameter()
{
	var f = document.getElementById("frm");
	if(!f.enblinkloc.checked)
	{
	 	if (isValidIPv6Address(f.ipv6addr.value)==false)
	  	{
		  	dx_alert_error_message(f.ipv6addr,m_ipv6addr_error);
			return false;
	  	}
		if(CheckNumericRange(f.prefixlength,0,128,m_subnetpre_length)==false)
		  	return false;
	}
	if(!isValidIPv6Address(f.gateway.value,1))
	{
		dx_alert_error_message(f.gateway,m_ipv6gw_error);
		return false;
	}
	return true;
}

function do_url()
{
	var f = document.getElementById("frm");
	var idx = f.inf_name.value;
	if(idx != "")
	{
		var str=new String("");
		str += "sp_ipv6_staticipv6.xgi?connow="+idx;
		return str;
	}
	else
	{
		alert(m_ipv6_no_default_route);
	}
}
</script>
