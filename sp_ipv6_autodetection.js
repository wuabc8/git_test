<script>
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
			//f.conn_type[1].selected = true;
			//f.inf_name[tmp].selected = true;
		}
		/*iana and iapd sending control. VINCENT W.*/
		DisplayShow("show_iana_enable","tr");
		DisplayShow("show_iapd_enable","tr");
		f.iana_enable.checked = (datalist_ipv6[tmp][18] == "1" ? true : false);
		f.iapd_enable.checked = (datalist_ipv6[tmp][19] != "0" ? true : false);
		DisplayShow("show_hint_enable","tr");
		f.hint_enable.checked = (datalist_ipv6[tmp][20] == "1" ? true : false);
		hint_solicit_click();
		if(dataipv6_dns[tmp])
		{
			if(dataipv6_dns[tmp].mode == "1")
			{
				f.dnstype[1].checked = true;
			}
			else
			{
				f.dnstype[0].checked = true;
			}
			f.pridns.value = dataipv6_dns[tmp].entry;
			f.secdns.value = dataipv6_dns[tmp].entry2;
		}
		if(wanipv6status[tmp])
		{
			if(f.pridns.value == "" && wanipv6status[tmp].dns1 != "")
				f.pridns.value = wanipv6status[tmp].dns1;
			if(f.secdns.value == "" && wanipv6status[tmp].dns2 != "")
				f.secdns.value = wanipv6status[tmp].dns2;
		}
		f.inf_name.value = tmp;
		/*VINCENT W.*/
		if(parseInt(datalist_ipv6[tmp][4]) == 1)
			f.enableDHCPv6_16.checked = true;
		f.opt16_enterprise_number.value = datalist_ipv6[tmp][5];
		f.VCD.value=datalist_ipv6[tmp][6];
		
		f.enableDHCPv6_1.checked = true;
		switch(parseInt(datalist_ipv6[tmp][8]))
		{
			case 1:
				f.DUID[0].checked=true;
				break;
			case 2:
				f.DUID[1].checked=true;
				break;
			case 3:
				f.DUID[2].checked=true;
				break;
			default:
				f.DUID[1].checked=true;
				break;
		}
		if(parseInt(datalist_ipv6[tmp][11]) == 1)
		{
			f.enableDHCPv6_17.checked = true;
		}
		
		f.duid_enterprise_number.value=datalist_ipv6[tmp][9];
		f.vendor_id.value=datalist_ipv6[tmp][10];
		f.opt17_enterprise_number.value = datalist_ipv6[tmp][12];
		f.manufacturer_oui.value=datalist_ipv6[tmp][13];
		f.product_class.value=datalist_ipv6[tmp][14];
		f.model_name.value=datalist_ipv6[tmp][15];
		f.serial_number.value=datalist_ipv6[tmp][16];
		
		if(parseInt(datalist_ipv6[tmp][17]) == 1)
		{
			f.TR069_CPE_ID.checked = true;
		}
		/*VINCENT W.*/
	}
	else
	{
		f.inf_name.value = "";
	}
	/*VINCENT W.*/
	DHCPv6Click(16);
	DHCPv6Click(1);
	DHCPv6Click(17);
	/*VINCENT W.*/
	f.conn_type.value = "AutoDetection";
	uiDoOnLoad_Comm();
	dns_change();
}

function dns_change(){
	var f = document.getElementById("frm");
	if(f.dnstype[1].checked)
	{
		DisplayShow("show_pridns","tr");
		DisplayShow("show_secdns","tr");
	}
	else
	{
		DisplayHide("show_pridns");
		DisplayHide("show_secdns");
	}
}

function doSubmit()
{
	var f = document.getElementById("frm");
	var idx = f.inf_name.value;
	if(idx != "")
	{
		var str=new String("");
		str += "sp_ipv6_autodetection.xgi?connow="+idx+"&";
		if (checkDNSParameter()==false||check_lanipv6_cfg()==false)
			return;
		if(physical_type == '0')
			str+="setPath=/ipv6/dsl:"+(parseInt(idx)+1)+"/";
		else
			str+="setPath=/ipv6/eth:"+(parseInt(idx)+1)+"/";
	
		str +="&mode="+f.conn_type.value;
		str +="&enable="+(f.ipv6enable.checked ? "1" : "0");
		str +="&dhcpv6_iana_enable="+(f.iana_enable.checked ? "1" : "0");/*control IA_NA VINCENT W.*/
		str +="&dhcpv6_iapd_enable="+(f.iapd_enable.checked ? "1" : "0");/*control IA_PD VINCENT W.*/
/*VINCENT W. 2017/1/12*/
		str +="&hint_enable="+(f.hint_enable.checked ? "1" : "0");
		if(f.hint_enable.checked)
		{
			if(f.hint_iapd.value == "" || f.hint_iapd_len.value == "")
			{
				dx_alert_error_message(f.hint_iapd, "This value can't be empty.");
				return false;
			}
			if (isValidIPv6Address(f.hint_iapd.value)==false)
			{
				dx_alert_error_message(f.hint_iapd,"Invalid IPv6 address");
				return false;
			}
			if(CheckNumericRange(f.hint_iapd_len,0,64,"Hint prefix length")==false)
				return false;
			str +="&hint_iapd="+f.hint_iapd.value;
			str +="&hint_iapd_length="+f.hint_iapd_len.value;
		}
		str+="&"+"dhcpv6/enable_16="+(f.enableDHCPv6_16.checked?1:0);
		if (f.enableDHCPv6_16.checked)
		{
			str+="&"+"dhcpv6/option16_enterprise_num="+f.opt16_enterprise_number.value;
			str+="&"+"dhcpv6/vendor_class_data="+f.VCD.value;
		}
		str+="&"+"dhcpv6/enable_1="+(f.enableDHCPv6_1.checked?1:0);
		if (f.enableDHCPv6_1.checked)
		{
			if(f.DUID[1].checked)
			{
				str+="&"+"dhcpv6/option1_enterprise_number="+f.duid_enterprise_number.value;
				str+="&"+"dhcpv6/vendor_id="+f.vendor_id.value;
			}
			str+="&"+"dhcpv6/dhcpv6_duid="+ (f.DUID[0].checked ? 1 : (f.DUID[1].checked ? 2 : 3));
		}
		str+="&"+"dhcpv6/enable_17="+(f.enableDHCPv6_17.checked?1:0);
		if(f.enableDHCPv6_17.checked)
		{
			str+="&"+"dhcpv6/dhcpv6_option17_enterprise_num="+f.opt17_enterprise_number.value;
			str+="&"+"dhcpv6/dhcpv6_option17_manufacturer_oui="+f.manufacturer_oui.value;
			str+="&"+"dhcpv6/dhcpv6_option17_product_class="+f.product_class.value;
			str+="&"+"dhcpv6/dhcpv6_option17_model_name="+f.model_name.value;
			str+="&"+"dhcpv6/dhcpv6_option17_serial_number="+f.serial_number.value;
		}
		str+="&"+"dhcpv6/dhcpv6_use_tr069_cpe_id="+(f.TR069_CPE_ID.checked?1:0);
/*VINCENT W. 2017/1/12*/
		//if(f.dhcppd.checked)
		//	str +="&dhcpv6opt=IA-PD";
		//else
		//	str +="&dhcpv6opt=";
		if(f.dnstype[1].checked)
		{
			str +="&dns/mode=1";		
			str +="&dns/entry="+f.pridns.value;
			str +="&dns/entry2="+f.secdns.value;
		}
		else 
			str +="&dns/mode=0";
		str +="&endSetPath=1";
		str += ipv6lanside_submit();
		if(f.ipv6enable.checked)
		{
			str+="&"+"set/wan/dsl/inf:1/vlanmux/entry:2/ppp/ipv6_passthrough=0";
		}
		if(f.ipv6enable.checked == false)
		{
			/*if ipv6 disabled, the mode can't be "only ipv6". added by VINCENT W.*/
			str+="&"+"set/wan/dsl/inf:1/vlanmux/entry:"+(parseInt(idx))+"/only_ipv6=0";
		}
		str+="&CMT=0";
		/*I think this part of "if" make no sense. VINCENT W.*/
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

function do_url()
{
	var f = document.getElementById("frm");
	var idx = f.inf_name.value;
	if(idx != "")
	{
		var str=new String("");
		str += "sp_ipv6_autodetection.xgi?connow="+idx;
		return str;
	}
	else
	{
		alert(m_ipv6_no_default_route);
	}
}
</script>
