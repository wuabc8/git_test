<script>
var wanif_max	= LayoutObj.system_wanif_max;
var system_conn_max="<?ConfigGet(/runtime/layout/system_conn_max)?>";
var dsl_wanif_max="<?ConfigGet(/runtime/layout/dsl_wanif_max)?>";
var eth_wanif_max="<?ConfigGet(/runtime/layout/eth_wanif_max)?>";
var interfaceid = parseInt("<?echo($(connow))?>");
var wan_inf = new Array;

<?if_node(/wan/physical_type == 0)?>
<?$ipv6_wan_xml=/ipv6/dsl#;?>
<?$ipv6_rt_wan_xml=/runtime/ipv6/dsl#;?>
<?else_node?>
<?$ipv6_wan_xml=/ipv6/eth#;?>
<?$ipv6_rt_wan_xml=/runtime/ipv6/eth#;?>
<?endif_node?>

var droute="<?ConfigGet(/wan/defaultroute)?>";

var datalist_ipv6 = [<?ConfigGetArray($(ipv6_wan_xml)/
					,mode
					,ipv6addrgen
					,dhcpv6opt
					,enable
					,dhcpv6/enable_16
					,dhcpv6/option16_enterprise_num
                			,dhcpv6/vendor_class_data
                			,dhcpv6/enable_1
                			,dhcpv6/dhcpv6_duid
                			,dhcpv6/option1_enterprise_number
                			,dhcpv6/vendor_id
                			,dhcpv6/enable_17
                			,dhcpv6/dhcpv6_option17_enterprise_num
                			,dhcpv6/dhcpv6_option17_manufacturer_oui
                			,dhcpv6/dhcpv6_option17_product_class
                			,dhcpv6/dhcpv6_option17_model_name
                			,dhcpv6/dhcpv6_option17_serial_number
                			,dhcpv6/dhcpv6_use_tr069_cpe_id
                			,dhcpv6_iana_enable
                			,dhcpv6_iapd_enable
                			,hint_enable
                			,hint_iapd
                			,hint_iapd_length
					)?>];
					//add dhcpv6 option to datalist array by VINCENT W.
var tr069_cpe_id_value = "<?ConfigGet(/tr069/deviceinfo/deviceid)?>";					
var datalist_ipv6dns = [<?ConfigGetArray($(ipv6_wan_xml)/dns/
						,mode
						,entry
						,entry2 
						)?>];

var datalist_wanipv6status = [<?ConfigGetArray($(ipv6_rt_wan_xml)/
					,mode
					,state
					,ipaddr
					,prefix
					,gateway
					,dns1
					,dns2
					)?>];

var lanipv6addr="<?ConfigGet(/runtime/ipv6/lanipv6addr)?>";
var pd_prefix="<?ConfigGet(/runtime/ipv6/pd_prefix)?>";


if(physical_type == "0")
{
	if(dsl_wanif_max == 1)
	{
		var wan_type = "<?ConfigGet(/wan/dsl/inf:1/wan_type)?>";
		if(wan_type == 1)
		{
			//wan/dsl/inf:1/vlanmux/entry:%d/mode, 2012-03-07
			var wan_inf_mode = [<?ConfigGetArrayElement(/wan/dsl/inf:1/vlanmux/entry#/mode)?>];
			//wan/dsl/inf:1/vlanmux/entry:%d/enable, 2012-03-07
			var wan_inf_enable = [<?ConfigGetArrayElement(/wan/dsl/inf:1/vlanmux/entry#/enable)?>];
		}
		if(wan_type == 2)
		{
			var wan_inf_mode = [<?ConfigGetArrayElement(/wan/dsl/inf:1/msc/entry#/mode)?>];
			var wan_inf_enable = [<?ConfigGetArrayElement(/wan/dsl/inf:1/msc/entry#/enable)?>];
		}
	}
	else
	{
		var wan_inf_mode = [<?ConfigGetArrayElement(/wan/dsl/inf#/mode)?>];
		var wan_inf_enable = [<?ConfigGetArrayElement(/wan/dsl/inf#/enable)?>];
	}
}
else
{
	var wan_inf_mode = [<?ConfigGetArrayElement(/wan/ethernet/inf#/mode)?>];
	var wan_inf_enable = [<?ConfigGetArrayElement(/wan/ethernet/inf#/enable)?>];
}

if(physical_type == "0")
{
	for (var i=0; i<system_conn_max; i++)
	{
		if(dsl_wanif_max == 1)
		{
			if(i==0)
				wan_inf[wan_inf.length] = "WAN1";
			else
			{
				wan_inf[wan_inf.length] = "WAN1_"+(i);
			}
		}
		else
			wan_inf[wan_inf.length] = "PVC"+(i+1);
	}
}
else
{
	for (var i=0; i<system_conn_max; i++)
	{
		wan_inf[wan_inf.length] = "WAN"+(i+1);
	}
}

var datalist_ipv6lanside =<?ConfigGetArray(/ipv6lanside/
				,autoconfig
				,mode
				,ralivetime 
				,pdaddr_beg
				,pdaddr_beg_postfix
				,pdaddr_end
				,pdaddr_end_postfix
				,dhcpv6pd
				,dhcpv6pdprefixlength
				,ula
				,ramtu_to_lan
				,dhcpv6opt
				,dhcpv6_assign_ip_by_mac/enable
				,dhcpv6_assign_ip_by_port/enable
				)?>;
				
<SPRE_IFDEF ELBOX_DHCPV6_ASSIGN_IP_BY_MAC
var datalist_dhcpv6_assign_ip_by_mac =[<?ConfigGetArray(/ipv6lanside/dhcpv6_assign_ip_by_mac/rule#/
						,mac
						,postfix
						)?>];
var datalist_dhcpv6_assign_ip_by_port =[<?ConfigGetArray(/ipv6lanside/dhcpv6_assign_ip_by_port/rule#/
						,port
						,postfix
						)?>];
var mac_datacount = check_mac_datalists_count();
var port_datacount = check_port_datalists_count();
var mac_entry_limit=32;
var port_entry_limit=8;
SPRE_ENDIF>

var lanipv6 = <?ConfigGetArray(/ipv6lanside/
				,addr
				,prefixlen
				)?>;

var lanipv6linklocaladdr = "<?ConfigGet(/runtime/ipv6/lanipv6ll)?>";
var ipv6lanside = creat_ipv6lanside();
var dataipv6 = creat_lanipv6_addr();
var dataipv6_dns = creat_lanipv6_dns();
var wanipv6status = creat_wanipv6_status();

function obj_ipv6lanside(autoconfig,mode,ralivetime,pdaddr_beg,pdaddr_beg_postfix,pdaddr_end,pdaddr_end_postfix,dhcpv6pd,dhcpv6_pre_length,ula,ramtu_to_lan,dhcpv6opt)
{
	this.autoconfig = autoconfig;
	this.mode = mode;
	this.ralivetime  = ralivetime;
	this.pdaddr_beg = pdaddr_beg;
	this.pdaddr_beg_postfix = pdaddr_beg_postfix;
	this.pdaddr_end = pdaddr_end;
	this.pdaddr_end_postfix = pdaddr_end_postfix;
	this.dhcpv6pd = dhcpv6pd;
	this.dhcpv6_pre_length = dhcpv6_pre_length;
	this.ula = ula;
	this.ramtu_to_lan = ramtu_to_lan;
	this.dhcpv6opt = dhcpv6opt;
}
function obj_lanipv6_addr(mode,ipv6addrgen,dhcpv6opt,active,addr,prefix)
{
  this.mode = mode;
  this.ipv6addrgen = ipv6addrgen;
  this.dhcpv6opt = dhcpv6opt;
  this.addr = addr;
  this.prefix = prefix;
  this.active = active;
}

function ipv6_count()
{	
    var count=0;
    for (var i=0;i < datalist_ipv6[0].length;i++)
    {
        if (datalist_ipv6[0][i].length)
        {
           count=datalist_ipv6.length;
           break;
        }
    }
    return count;
}
function ipv6dns_count()
{	
    var count=0;
    for (var i=0;i < datalist_ipv6dns[0].length;i++)
    {
        if (datalist_ipv6dns[0][i].length)
        {
           count=datalist_ipv6dns.length;
           break;
        }
    }
    return count;
}
function creat_lanipv6_addr()
{
  var lists=new Array();
    for (var i=0;i<datalist_ipv6.length;i++)
    {
        lists[lists.length]=new obj_lanipv6_addr(datalist_ipv6[i][0],datalist_ipv6[i][1],datalist_ipv6[i][2],datalist_ipv6[i][3],lanipv6[0],lanipv6[1]);
    }
    return lists;
}

function creat_ipv6lanside()
{
  var lists=new Array();
  lists=new obj_ipv6lanside(datalist_ipv6lanside[0],datalist_ipv6lanside[1],datalist_ipv6lanside[2],datalist_ipv6lanside[3],datalist_ipv6lanside[4],datalist_ipv6lanside[5],datalist_ipv6lanside[6],datalist_ipv6lanside[7],datalist_ipv6lanside[8],datalist_ipv6lanside[9],datalist_ipv6lanside[10],datalist_ipv6lanside[11]);
  return lists;
}

function object_lanipv6_dns (mode,entry,entry2)
{
	this.mode = mode;
	this.entry = entry;
	this.entry2 = entry2;
}

function creat_lanipv6_dns()
{
	var lists=new Array();
    for (var i=0;i<datalist_ipv6dns.length;i++)
    {
        lists[lists.length]=new object_lanipv6_dns(datalist_ipv6dns[i][0],datalist_ipv6dns[i][1],datalist_ipv6dns[i][2]);
    }
    return lists;
}

function obj_wanipv6_status(mode,state,ipaddr,prefix,gateway,dns1,dns2)
{
	this.mode = mode;
	this.state = state;
	this.ipaddr = ipaddr;
	this.prefix = prefix;
	this.gateway = gateway;
	this.dns1 = dns1;
	this.dns2 = dns2;
}

function creat_wanipv6_status()
{
	var lists=new Array();
	for (var i=0;i<datalist_wanipv6status.length;i++)
	{
	    lists[lists.length]=new obj_wanipv6_status(datalist_wanipv6status[i][0],datalist_wanipv6status[i][1],datalist_wanipv6status[i][2],datalist_wanipv6status[i][3],datalist_wanipv6status[i][4],datalist_wanipv6status[i][5],datalist_wanipv6status[i][6]);
	}
	return lists;
}

function IPv6_Change(){
	var f = document.getElementById("frm");
	var temp = f.conn_type.value;
	var loc = "";
	switch(temp)
	{
	    case "AutoDetection":
		{			
			loc = "sp_ipv6_autodetection.htm";
			break;
	    }
		case "STATIC":
		{
			loc = "sp_ipv6_staticipv6.htm";
			break;
		}
		case "6IN4":
		{
			loc = "sp_ipv6_ipv6overipv4tun.htm";
			break;
		}
		case "6TO4":
		{
			loc = "sp_ipv6_6to4.htm";
			break;
		}
		case "6RD":
		{
			loc = "sp_ipv6_6rd.htm";
			break;
		}
		case "PPPDHCPv6PD":
		{			
			 loc = "sp_ipv6_pppoe.htm";
			 break;
		}
		default:
		{
			 loc = "sp_ipv6_linkloc.htm";
			 break;
		}
	}
	loc += "?connow="+f.inf_name.value;
	self.location.href = loc;
}

function check_lanipv6_cfg()
{
	if((interfaceid+1) != droute)
		return;
	
	var f = document.getElementById("frm");
	//if(f.conn_type[1].selected || f.conn_type[3].selected || f.conn_type[6].selected)
	if(f.conn_type.value=="AutoDetection"|| f.conn_type.value=="6IN4" || f.conn_type.value=="PPPDHCPv6PD")
	{
		if(!f.dhcppd.checked)
		{
			if(isValidIPv6Address(f.lanipaddr.value)==false)
			{
				dx_alert_error_message(f.lanipaddr,m_lanip_error);
				return false;
			}
			if(CheckNumericRange(f.prefix_lan,0,64,m_lanip_prefix)==false)
				return false;
		}
	}
	//else if(f.conn_type[2].selected || f.conn_type[4].selected || f.conn_type[5].selected)
	else if(f.conn_type.value=="STATIC"|| f.conn_type.value=="6TO4" || f.conn_type.value=="6RD")
	{
		if(isValidIPv6Address(f.lanipaddr.value)==false)
		{	
			dx_alert_error_message(f.lanipaddr,m_lanip_error);
			return false;
		}
		if(CheckNumericRange(f.prefix_lan,0,64,m_lanip_prefix)==false)
			return false;
	}
	if(f.autocfgtyp.value == '1' && !f.auto_dhcp_pd.checked)
	{
		if(f.ipv6_range_s.value != f.ipv6_range_e.value)
		{
			dx_alert_error_message(f.ipv6_range_e, "the prefix is not the same");
			return false;
		}
		if(f.prefix_ipv6_range_s.value.length ==0)
		{
			dx_alert_error_message(f.prefix_ipv6_range_s,"The value can't be empty.");
			return false;
		}
		if(!isHex(f.prefix_ipv6_range_s.value) || parseInt(f.prefix_ipv6_range_s.value,16) < 0x1 || parseInt(f.prefix_ipv6_range_s.value,16) > 0xff)
		{
			dx_alert_error_message(f.prefix_ipv6_range_s,m_range_prefix);
			return false;
		}
		if(!f.ipv6_range_s.disabled)
		{
			var tmp = f.ipv6_range_s.value+"00"+f.prefix_ipv6_range_s.value;
			if(isValidIPv6Address(tmp)==false)
			{
				dx_alert_error_message(f.ipv6_range_s,m_ipstart_error);
				return false;
			}
		}
		
		if(f.prefix_ipv6_range_e.value.length ==0)
		{
			dx_alert_error_message(f.prefix_ipv6_range_e,"The value can't be empty.");
			return false;
		}
		if(!isHex(f.prefix_ipv6_range_e.value) || parseInt(f.prefix_ipv6_range_e.value,16) < 0x1 || parseInt(f.prefix_ipv6_range_e.value,16) > 0xff)
		{
			dx_alert_error_message(f.prefix_ipv6_range_e,m_range_prefix);
			return false;
		}
		if(!f.ipv6_range_e.disabled)
		{
			var tmp = f.ipv6_range_e.value+"00"+f.prefix_ipv6_range_e.value;
			if(isValidIPv6Address(tmp)==false)
			{
				dx_alert_error_message(f.ipv6_range_e,m_ipend_error);
				return false;
			}
		}
		
		if(parseInt(f.prefix_ipv6_range_s.value,16) > parseInt(f.prefix_ipv6_range_e.value,16))
		{
			dx_alert_error_message(f.prefix_ipv6_range_e,"Invalid IPv6 Address Range");
			return false;
		}
	}
	if(!f.enbautoipv6.checked && isInteger(f.lifetime.value)==false)
	{
		dx_alert_error_message(f.lifetime,m_int_error);
		return false;
	}
}

function onclickdhcppd()
{
	var f = document.getElementById("frm");
	if(f.dhcppd.checked)
	{
		DisplayHide("show_lanipaddr");
<SPRE_IFDEF ELBOX_WEBSTYLE_DLINK_CHT
<SPRE_ELSE
		DisplayShow("show_auto_dhcp_pd","tr");
SPRE_ENDIF>
	}
	else
	{
		DisplayShow("show_lanipaddr","tr");
		DisplayHide("show_auto_dhcp_pd");
	}
	autocfgtyp_change();
}

function onclick_ipv6lanside()
{
	var f = document.getElementById("frm");
	if(f.enbautoipv6.checked)
	{
<SPRE_IFDEF ELBOX_WEBSTYLE_DLINK_CHT
<SPRE_ELSE
		if(f.conn_type.value != "STATIC")
			f.auto_dhcp_pd.checked = true;
		else
			f.auto_dhcp_pd.checked = false;
SPRE_ENDIF>
		DisplayHide("show_life_time");
		f.lifetime.disabled = true;
	}
	else
	{
		f.auto_dhcp_pd.checked = false;
		DisplayShow("show_life_time","tr");
		f.lifetime.disabled = false;
		f.lifetime.value = ipv6lanside.ralivetime;
	}	
}
function uiDoOnLoad_Comm()
{
	if((interfaceid+1) != droute)
	{		
		document.getElementById("show_lanipv6").style.display="none";
		document.getElementById("show_Autocfg").style.display="none";
		return;
	}
	else
	{
		document.getElementById("show_lanipv6").style.display="";
		document.getElementById("show_Autocfg").style.display="";
	}	
		
	var f = document.getElementById("frm");
	var tmp = parseInt("<?echo($(connow))?>");
	if("<?echo($(connow))?>" != "")
	{
	/*lanipv6_cfg*/
	if(dataipv6[tmp])
	{
	f.lanipaddr.value = dataipv6[tmp].addr;
	f.prefix_lan.value = dataipv6[tmp].prefix;
	if(ipv6lanside.dhcpv6opt == "IA-PD")
		f.dhcppd.checked = true;
	else
		f.dhcppd.checked = false;
	}
	if(f.lanipaddr.value == "" && lanipv6addr != "")
		f.lanipaddr.value = lanipv6addr;
	//if(f.conn_type[1].selected || f.conn_type[3].selected || f.conn_type[6].selected)
	if(f.conn_type.value=="AutoDetection" || f.conn_type.value=="6IN4" || f.conn_type.value=="PPPDHCPv6PD")
		onclickdhcppd();
	/*Autocfg*/
	if(ipv6lanside.autoconfig == "1" || ipv6lanside.autoconfig == "")
	{
		f.enbautoipv6.checked = true;
		DisplayHide("show_life_time");
		f.lifetime.disabled = true;
	}
	else
	{
		f.enbautoipv6.checked = false;
		DisplayShow("show_life_time","tr");
		f.lifetime.disabled = false;
		f.lifetime.value = ipv6lanside.ralivetime;
	}
	if(ipv6lanside.mode != "")
		f.autocfgtyp.value = ipv6lanside.mode;
	else
		f.autocfgtyp.value = 3;
	if(ipv6lanside.ula == "1")
		f.ula.checked = true;
	else
		f.ula.checked = false;
	if(f.conn_type.value == "STATIC")
		f.auto_dhcp_pd.checked = false;
	else if(ipv6lanside.dhcpv6pd == "1" || ipv6lanside.dhcpv6pd == "")
		f.auto_dhcp_pd.checked = true;
	else
		f.auto_dhcp_pd.checked = false;
		
	if(ipv6lanside.ramtu_to_lan == "0")
		f.ramtu_to_lan.checked = false;
	else
		f.ramtu_to_lan.checked = true;		
		
	f.ipv6_range_s.value = ipv6lanside.pdaddr_beg;
	if(f.ipv6_range_s.value == "" && pd_prefix != "")
		f.ipv6_range_s.value = pd_prefix;
	f.prefix_ipv6_range_s.value = ipv6lanside.pdaddr_beg_postfix;
	f.ipv6_range_e.value = ipv6lanside.pdaddr_end;
	if(f.ipv6_range_e.value == "" && pd_prefix != "")
		f.ipv6_range_e.value = pd_prefix;
	f.prefix_ipv6_range_e.value = ipv6lanside.pdaddr_end_postfix;
	f.dhcpv6prelength.value = ipv6lanside.dhcpv6_pre_length;
	}
	autocfgtyp_change();
}
function Inf_Change(){
	var f = document.getElementById("frm");
	//var loc = thisFilename+'?connow='+f.inf_name.selectedIndex;
	//var loc = 'sp_ipv6.htm?connow='+f.inf_name.selectedIndex;
	var loc = 'sp_ipv6.htm?connow='+f.inf_name.value;
	self.location.href = loc;
}
function ipv6gen_change()
{
	var f = document.getElementById("frm");
	if(f.ipv6addrgen[0].checked)
		f.lanipaddr.disabled = true;
	else
		f.lanipaddr.disabled = false;
}
function gen_ipv6_table(){
	var str= '';
	str += '<h2>'+m_ipv6_contyp+'</h2>';
	str += '<p>'+m_ipv6contyp_desc+'</p>';
	str += '<table cellpadding="1" cellspacing="1" border="0" width="525">';
	str += '<tr><td class="r_tb" width="200">'+m_ipv6_interface+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;';
	str += '<select name="inf_name" id="inf_name" onChange="Inf_Change()">';
	if(dsl_wanif_max == 1)
	{
		for(var i=0;i<wan_inf.length;i++)
		{
			if(i > 0 && wan_inf_mode[i-1] != "5" && wan_inf_enable[i-1] == "1")
			{
				if(droute == (i+1))
				{
					str += '<option value="'+i+'" selected>'+wan_inf[i]+'</option>';
				}
				else
				{
					str += '<option value="'+i+'">'+wan_inf[i]+'</option>';	
				}		
			}	
		}
	}
	else
	{
		for(var i=0;i<wan_inf.length;i++)
		{
			if(wan_inf_mode[i] != "5" && wan_inf_enable[i] == "1")
			{
				if(droute == (i+1))
				{
					str += '<option value="'+i+'" selected>'+wan_inf[i]+'</option>';
		 		}
		 		else
		 		{
		 			str += '<option value="'+i+'">'+wan_inf[i]+'</option>';
		 		}		
		 	}
		}
	}
	str += '</select></td></tr>';
	str += '<tr><td class="r_tb" width="200" height=30>'+m_ipv6_con+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;';	
	str += '<select name="conn_type" id="conn_type" width="200" onChange="IPv6_Change()">';
//	str += '<option value="LL">Link-local only</option>';
	str += '<option value="AutoDetection">Autoconfiguration(SLAAC/DHCPv6)</option>';
	str += '<option value="STATIC">Static IPv6</option>';
//	str += '<option value="6IN4">IPv6 over IPv4 Tunnel</option>';
//	str += '<option value="6TO4">6to4</option>';
//	str += '<option value="6RD">6rd</option>';
	str += '<option value="PPPDHCPv6PD">PPPoE</option>';
	str += '</select></td></tr>';
	str += '<tr><td class="r_tb" width="200">'+m_ipv6_enable+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" name="ipv6enable" id="ipv6enable"></td></tr>';
	str += '<tr id="show_iana_enable"><td class="r_tb" width="200">'+"IA-NA enable"+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" name="iana_enable" id="iana_enable"></td></tr>';
	str += '<tr id="show_iapd_enable"><td class="r_tb" width="200">'+"IA-PD enable"+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" name="iapd_enable" id="iapd_enable"></td></tr>';
	str += '<tr id="show_hint_enable"><td class="r_tb" width="200">'+"Hint solicit enable"+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" onclick="hint_solicit_click()" name="hint_enable" id="hint_enable"></td></tr>';
	str += '<tr id="show_hint_iapd"><td class="r_tb" width="200">'+"Hint solicit IAPD"+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="text" name="hint_iapd" id ="hint_iapd" size="40">/<input type="text" name="hint_iapd_len" id ="hint_iapd_len" size="5">';
	str += '</td></tr>'
	str += "<tr><td>&nbsp;&nbsp;</td></tr></table>";

	document.write(str);
}

function gen_lanipv6_cfg_table(intnum,num)
{
	if((interfaceid+1) != droute)
		return;
		
	var str= '';
	str += '<h2>'+m_lanipv6_addrset+'</h2>';
	if(num == 0)
	{
		str += '<p>'+m_lanipv6addr_desc+'</p>';
		str += '<table cellpadding="1" cellspacing="1" border="0" width="525">';
		str += '<tr id="show_ula"><td class="r_tb" width="200" align="left">'+m_ula+' :</td>';
		str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" name="ula" id ="ula"></td></tr>';
		str += '<tr id="ramtu_to_lan"><td class="r_tb" width="200" align="left">'+m_ra_mtu_to_lan+' :</td>';
		str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" name="ramtu_to_lan" id ="ramtu_to_lan"></td></tr>';
		str += '<tr><td class="r_tb" width="200">'+m_lanipv6local_addr+' :</td>';
		str += '<td class="l_tb" size="200">&nbsp;&nbsp;';
		str += lanipv6linklocaladdr+'/64</td></tr>'
		str += '</table>';
	}
	else
	{
		str += '<p>'+m_lanipv6addr_desc_1+'</p>';
		str += '<table cellpadding="1" cellspacing="1" border="0" width="525">';
		str += '<tr id="show_ula"><td class="r_tb" width="200" align="left">'+m_ula+' :</td>';
		str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" name="ula" id ="ula"></td></tr>';
		str += '<tr id="show_dhcppd"><td class="r_tb" width="200" align="left">'+m_dhcp_pd+' :</td>';
		str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" name="dhcppd" id ="dhcppd" onclick=onclickdhcppd()></td></tr>';
		str += '<tr id="show_ramtu_to_lan"><td class="r_tb" width="200" align="left">'+m_ra_mtu_to_lan+' :</td>';
		str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" name="ramtu_to_lan" id ="ramtu_to_lan"></td></tr>';
		str += '<tr id="show_lanipaddr"><td class="r_tb" width="200">'+m_lanipv6_addr+' :</td>';
		str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="text" name="lanipaddr" id ="lanipaddr" size="40">/<input type="text" name="prefix_lan" id ="prefix_lan" size="5">';
		str += '</td></tr>'
		str += '<tr><td class="r_tb" width="200">'+m_lanipv6local_addr+' :</td>';
		str += '<td class="l_tb" size="200">&nbsp;&nbsp;'+lanipv6linklocaladdr+'/64';
		str += '</td></tr>'
		str += '<tr><td>&nbsp;&nbsp;</td></tr>';
		str += '</table>';
	}
	document.write(str);
}

function autocfgtyp_change()
{
	var f = document.getElementById("frm");
	if(f.autocfgtyp.value == '1')
	{
<SPRE_IFDEF ELBOX_WEBSTYLE_DLINK_CHT
<SPRE_ELSE
		if(f.conn_type.value != "STATIC")
			DisplayShow("show_auto_dhcp_pd","tr");
		else
			DisplayHide("show_auto_dhcp_pd");
SPRE_ENDIF>
		if(f.auto_dhcp_pd.checked)
		{
			if(f.dhcppd.checked)
				DisplayHide("show_pd_prefix_length");
			else
				DisplayShow("show_pd_prefix_length","tr");
			DisplayHide("show_range_s");
			DisplayHide("show_range_e");
		}
		else
		{
			if(f.dhcppd.checked && f.conn_type.value != "STATIC")
			{
				f.ipv6_range_s.disabled = true;
				f.ipv6_range_e.disabled = true;
			}
			else
			{
				f.ipv6_range_s.disabled = false;
				f.ipv6_range_e.disabled = false;
			}
			DisplayHide("show_pd_prefix_length");
			DisplayShow("show_range_s","tr");
			DisplayShow("show_range_e","tr");
		}
<SPRE_IFDEF ELBOX_DHCPV6_ASSIGN_IP_BY_MAC
		if(ipv6lanside.mode == 1)
		{
			DisplayShow("show_assign_ip_by_mac","tr");
			DisplayShow("show_assign_ip_by_port","tr");
			f.assign_ip_by_mac_enable.checked=(datalist_ipv6lanside[12]==1)?1:0;
			f.assign_ip_by_port_enable.checked=(datalist_ipv6lanside[13]==1)?1:0;
		}
		else
		{
			DisplayHide("show_assign_ip_by_mac");
			DisplayHide("show_assign_ip_by_port");
			f.assign_ip_by_mac_enable.checked=false;
			f.assign_ip_by_port_enable.checked=false;
		}
SPRE_ENDIF>
	}
	else
	{
		DisplayHide("show_auto_dhcp_pd");
		DisplayHide("show_pd_prefix_length");
		DisplayHide("show_range_s");
		DisplayHide("show_range_e");
<SPRE_IFDEF ELBOX_DHCPV6_ASSIGN_IP_BY_MAC
		DisplayHide("show_assign_ip_by_mac");
		DisplayHide("show_assign_ip_by_port");
		f.assign_ip_by_mac_enable.checked=false;
		f.assign_ip_by_port_enable.checked=false;
SPRE_ENDIF>
	}
<SPRE_IFDEF ELBOX_DHCPV6_ASSIGN_IP_BY_MAC
	by_mac_click();
	by_port_click();
SPRE_ENDIF>
	if(f.inf_name.value == "")
	{
		alert(m_ipv6_no_default_route);
	}
}
function gen_Autocfg_table()
{
	if((interfaceid+1) != droute)
		return;
	
	var str= '';
	str += '<h2>'+m_addr_autocfg+'</h2>';
	str += '<p>'+m_addr_autocfg_desc+'</p>';
	str += '<table cellpadding="1" cellspacing="1" border="0" width="525">';
<SPRE_IFDEF ELBOX_WEBSTYLE_DLINK_CHT
	str += '<tr style="display:none"><td class="r_tb" width="200" height=30>'+m_automatic_ipv6+' :</td>';
<SPRE_ELSE
	str += '<tr><td class="r_tb" width="200" height=30>'+m_automatic_ipv6+' :</td>';
SPRE_ENDIF>
	str += '<td class="l_tb">&nbsp;&nbsp;<input type="checkbox" name="enbautoipv6" id ="enbautoipv6" onClick=onclick_ipv6lanside()>';	
	str += '</td></tr>';

	str += '<tr><td class="r_tb" width="200" align="left">'+m_autocfg_typ+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<select name="autocfgtyp" id="autocfgtyp" onChange="autocfgtyp_change()">';	  		
	str += '<option value="'+3+'">SLAAC+Stateless DHCP+RDNSS</option>';
	str += '<option value="'+0+'">SLAAC+RDNSS</option>';
	str += '<option value="'+2+'">SLAAC+Stateless DHCP</option>';
	str += '<option value="'+1+'">Stateful DHCPv6</option>';
	str += '<option value="'+4+'">Stateful DHCPv6 Relay</option>';
	str += '</td></tr>';

<SPRE_IFDEF ELBOX_WEBSTYLE_DLINK_CHT
	str += '<tr id="show_auto_dhcp_pd" style="display:none"><td class="r_tb" width="200" height=30>'+m_auto_dhcp_pd+' :</td>';
<SPRE_ELSE
	str += '<tr id="show_auto_dhcp_pd"><td class="r_tb" width="200" height=30>'+m_auto_dhcp_pd+' :</td>';
SPRE_ENDIF>
	str += '<td class="l_tb">&nbsp;&nbsp;<input type="checkbox" name="auto_dhcp_pd" id ="auto_dhcp_pd" onClick=autocfgtyp_change()>';	
	str += '</td></tr>';
	
	str += '<tr id="show_pd_prefix_length"><td class="r_tb" width="200" align="left">'+m_pd_prefix_length+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<select name="dhcpv6prelength" id="dhcpv6prelength">';	  		
	str += '<option value=48>48</option>';
	str += '<option value=56>56</option>';
	str += '<option value=64>64</option>';
	str += '</td></tr>';
	
	str += '<tr id="show_range_s"><td class="r_tb" width="200" height=30>'+m_ipv6_range_s+' :</td>';
	str += '<td class="l_tb">&nbsp;&nbsp;<input type="text" name="ipv6_range_s" id ="ipv6_range_s" size="22" maxlength="21">00<input type="text" name="prefix_ipv6_range_s" id ="prefix_ipv6_range_s" size="3" maxlength="2"> (01 ~ ff)';	
	str += '</td></tr>';	
	str += '<tr id="show_range_e"><td class="r_tb" width="200" height=30>'+m_ipv6_range_e+' :</td>';
	str += '<td class="l_tb">&nbsp;&nbsp;<input type="text" name="ipv6_range_e" id ="ipv6_range_e" size="22" maxlength="21">00<input type="text" name="prefix_ipv6_range_e" id ="prefix_ipv6_range_e" size="3" maxlength="2"> (01 ~ ff)';	
	str += '</td></tr>';	
<SPRE_IFDEF ELBOX_DHCPV6_ASSIGN_IP_BY_MAC
	str += '<tr id="show_assign_ip_by_mac"><td class="r_tb" width="200">'+"Enable static IPv6 address"+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" onclick="by_mac_click()" name="assign_ip_by_mac_enable" id="assign_ip_by_mac_enable"></td></tr>';
	str += '<tr id="show_assign_ip_by_port"><td class="r_tb" width="200">'+"Assign Ipv6 address by LAN interface"+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="checkbox" onclick="by_port_click()" name="assign_ip_by_port_enable" id="assign_ip_by_port_enable"></td></tr>';
SPRE_ENDIF>
	str += '<tr id="show_life_time"><td class="r_tb" width="200" align="left">'+m_router_adv+' :</td>';
	str += '<td class="l_tb" size="200">&nbsp;&nbsp;<input type="text" name="lifetime" id ="lifetime"> ('+m_minutes+')';
    str += '</td></tr><tr><td>&nbsp;&nbsp;</td></tr></table>';
   document.write(str);
}
function ipv6lanside_submit()
{
	if((interfaceid+1) != droute)
		return;
	
	var str = "&setPath=/ipv6lanside/";
	var f = document.getElementById("frm");

	if(f.ula.checked)
	{
		str += "&ula=1";
	}
	else
	{
		str += "&ula=0";
	}
	//if(f.conn_type[1].selected || f.conn_type[3].selected || f.conn_type[6].selected)
	if(f.conn_type.value=="AutoDetection"|| f.conn_type.value=="6IN4" || f.conn_type.value=="PPPDHCPv6PD")
	{
		if(!f.dhcppd.checked)
		{
			str+="&addr="+f.lanipaddr.value;
			str+="&prefixlen="+f.prefix_lan.value;
			str +="&dhcpv6opt=";
		}
		else
		{
			str+="&addr=";
			str+="&prefixlen=";
			str +="&dhcpv6opt=IA-PD";
			str += "&pdaddr_beg=";
			str += "&pdaddr_end=";
		}	

	}
	//else if(f.conn_type[2].selected || f.conn_type[4].selected || f.conn_type[5].selected)
	else if(f.conn_type.value=="STATIC"|| f.conn_type.value=="6TO4" || f.conn_type.value=="6RD")
	{
		str +="&dhcpv6opt=";
		str+="&addr="+f.lanipaddr.value;
		str+="&prefixlen="+f.prefix_lan.value;
	}
	if(f.enbautoipv6.checked)
	{
		str += "&autoconfig=1";
	}
	else
	{
		str += "&autoconfig=0";
		str += "&ralivetime=" + f.lifetime.value;	
	}
	if(f.auto_dhcp_pd.checked)
	{
		str += "&dhcpv6pd=1";
		if(f.autocfgtyp.value == '1')
			str += "&dhcpv6pdprefixlength="+f.dhcpv6prelength.value;
	}
	else
	{
		str += "&dhcpv6pd=0";
		if(f.autocfgtyp.value == '1')
		{
			if(!f.ipv6_range_s.disabled)
				str += "&pdaddr_beg=" + f.ipv6_range_s.value;
			if(!f.ipv6_range_e.disabled)
				str += "&pdaddr_end=" + f.ipv6_range_e.value;
			str += "&pdaddr_beg_postfix=" + f.prefix_ipv6_range_s.value;
			str += "&pdaddr_end_postfix=" + f.prefix_ipv6_range_e.value;
		}
	}
	if(f.ramtu_to_lan.checked)
	{
		str += "&ramtu_to_lan=1";	
	}	
	else
	{
		str += "&ramtu_to_lan=0";	
	}	
	str += "&mode="+f.autocfgtyp.value;
<SPRE_IFDEF ELBOX_DHCPV6_ASSIGN_IP_BY_MAC
	if(f.autocfgtyp.value != '1')
	{
		str += "&dhcpv6_assign_ip_by_mac/enable=0";
		str += "&dhcpv6_assign_ip_by_port/enable=0";
	}
	else
	{
		str += "&dhcpv6_assign_ip_by_mac/enable="+(f.assign_ip_by_mac_enable.checked==true? "1" : "0");
		str += "&dhcpv6_assign_ip_by_port/enable="+(f.assign_ip_by_port_enable.checked==true? "1" : "0");
	}
SPRE_ENDIF>
	str +="&endSetPath=1";
	if(f.dhcppd.checked)
		if(physical_type == '0')
			str +="&set/ipv6/dsl:"+(interfaceid+1)+"/dhcpv6opt=IA-PD";
		else
			str +="&set/ipv6/eth:"+(interfaceid+1)+"/dhcpv6opt=IA-PD";
	else
		if(physical_type == '0')
			str +="&set/ipv6/dsl:"+(interfaceid+1)+"/dhcpv6opt=";
		else
			str +="&set/ipv6/eth:"+(interfaceid+1)+"/dhcpv6opt=";
	return str;
}


function checkDNSParameter()
{
	var f = document.getElementById("frm");
	
	//if(f.conn_type[2].selected || f.conn_type[4].selected || f.conn_type[5].selected|| f.dnstype[1].checked)
	if(f.conn_type.value=="STATIC" || f.conn_type.value=="6TO4" || f.conn_type.value=="6RD" || f.dnstype[1].checked)
	{
		if (isValidIPv6Address(f.pridns.value)==false)
		{
			dx_alert_error_message(f.pridns,m_pridns_error);
			return false;
		}
		if (f.secdns.value != "" && isValidIPv6Address(f.secdns.value)==false)
		{
			dx_alert_error_message(f.secdns,m_secdns_error);
			return false;
		}
	}	
	return true;
}
/*VINCENT W.*/
function DHCPv6Click(arg)
{
	var f = $("frm");
	if(arg == 16)
	{
		if(f.enableDHCPv6_16.checked == true)
		{
			f.opt16_enterprise_number.disabled = false;
			f.VCD.disabled =false;
		}
		else
		{
			f.opt16_enterprise_number.disabled = true;
			f.VCD.disabled =true;
		}
	}
	else if(arg == 1)
	{
		f.enableDHCPv6_1.disabled = true;
		if(f.enableDHCPv6_1.checked == true)
		{
			f.DUID[0].disabled =false;
			f.DUID[1].disabled =false;
			f.DUID[2].disabled =false;
			if(f.DUID[0].checked !=true && f.DUID[1].checked !=true && f.DUID[2].checked !=true)
				f.DUID[1].checked =true;
			if(f.DUID[1].checked == true)
			{
				f.duid_enterprise_number.disabled = false;
				f.vendor_id.disabled = false;
				f.TR069_CPE_ID.disabled = false;
			}
			else
			{
				f.duid_enterprise_number.disabled = true;
				f.vendor_id.disabled = true;
				f.TR069_CPE_ID.disabled = true;
			}
			USE_TR69_CPE_ID_Click();
		}
		else
		{
			f.DUID[0].disabled =true;
			f.DUID[1].disabled =true;
			f.DUID[2].disabled =true;
			f.duid_enterprise_number.disabled = true;
			f.vendor_id.disabled = true;
			f.TR069_CPE_ID.disabled = true;
		}
	}
	else if(arg == 17)
	{
		if(f.enableDHCPv6_17.checked == true)
		{
			f.opt17_enterprise_number.disabled = false;
			f.manufacturer_oui.disabled = false;
			f.product_class.disabled = false;
			f.model_name.disabled = false;
			f.serial_number.disabled = false;
		}
		else
		{
			f.opt17_enterprise_number.disabled = true;
			f.manufacturer_oui.disabled = true;
			f.product_class.disabled = true;
			f.model_name.disabled = true;
			f.serial_number.disabled= true;
		}
	}
}

function USE_TR69_CPE_ID_Click()
{
	var f = $("frm");
	var tmp = parseInt("<?echo($(connow))?>");
	if(f.TR069_CPE_ID.checked == true)
	{
		f.vendor_id.disabled = true;
		f.vendor_id.value = tr069_cpe_id_value;
	}
	else
	{
		if(f.TR069_CPE_ID.disabled == true)
			f.vendor_id.disabled = true;
		else
			f.vendor_id.disabled = false;
		f.vendor_id.value=datalist_ipv6[tmp][10];
	}
}
/*VINCENT W.*/

function hint_solicit_click()
{
	var f = $("frm");
	var tmp = parseInt("<?echo($(connow))?>");
	if(f.hint_enable.checked == true)
	{
		DisplayShow("show_hint_iapd","tr");
		f.hint_iapd.value = datalist_ipv6[tmp][21];
		f.hint_iapd_len.value = datalist_ipv6[tmp][22];
	}
	else
	{
		DisplayHide("show_hint_iapd");
	}
}

<SPRE_IFDEF ELBOX_DHCPV6_ASSIGN_IP_BY_MAC
function check_mac_datalists_count()
{
	var count = 0;
	for (var i = 0 ; i < datalist_dhcpv6_assign_ip_by_mac[0].length ; i++)
	{
		if (datalist_dhcpv6_assign_ip_by_mac[0][i].length)
		{
			count = datalist_dhcpv6_assign_ip_by_mac.length;
			break;
		}
	}
	return count;
}

function check_port_datalists_count()
{
	var count = 0;
	for (var i = 0 ; i < datalist_dhcpv6_assign_ip_by_port[0].length ; i++)
	{
		if (datalist_dhcpv6_assign_ip_by_port[0][i].length)
		{
			count = datalist_dhcpv6_assign_ip_by_port.length;
			break;
		}
	}
	return count;
}

function by_mac_click()
{
	var f = $("frm");
	var dhcpv6_lan_prefix = "";
	dhcpv6_lan_prefix = ipv6lanside.pdaddr_beg;
	if(dhcpv6_lan_prefix == "" && pd_prefix != "")
		dhcpv6_lan_prefix = pd_prefix;
	if(f.assign_ip_by_mac_enable.checked == true)
	{
		$("show_add_mac_Content").innerHTML = gen_add_mac_table()
		f.mac_dhcpv6_prefix.value = dhcpv6_lan_prefix;
		$("show_mac_Content").innerHTML = gen_mac_table();
	}
	else
	{
		$("show_add_mac_Content").innerHTML = "";
		$("show_mac_Content").innerHTML = "";
	}
}

function by_port_click()
{
	var f = $("frm");
	var dhcpv6_lan_prefix = "";
	dhcpv6_lan_prefix = ipv6lanside.pdaddr_beg;
	if(dhcpv6_lan_prefix == "" && pd_prefix != "")
		dhcpv6_lan_prefix = pd_prefix;
	if(f.assign_ip_by_port_enable.checked == true)
	{
		$("show_add_port_Content").innerHTML = gen_add_port_table();
		f.port_dhcpv6_prefix.value = dhcpv6_lan_prefix;
		$("show_port_Content").innerHTML = gen_port_table();
	}
	else
	{
		$("show_add_port_Content").innerHTML = "";
		$("show_port_Content").innerHTML = "";
	}
}

function gen_mac_table()
{
	var f = $("frm");
	var dhcpv6_lan_prefix = "";
	dhcpv6_lan_prefix = ipv6lanside.pdaddr_beg;
	if(dhcpv6_lan_prefix == "" && pd_prefix != "")
		dhcpv6_lan_prefix = pd_prefix;
	else if(dhcpv6_lan_prefix == "" && pd_prefix == "")
		dhcpv6_lan_prefix = "::";
	var str="";
	str+="<div class=box>";
	str+="<h2>"+"Existing Static IPv6 Addresses"+"</h2>";
	str +="<p>"+"Use this section to assign static IPv6 addresses. The static IPv6 address must be in the range of the statefull DHCPv6 address."+"</p>";
	str+="<table borderColor=#ffffff cellSpacing=1 cellPadding=2 width=525 bgColor=#dfdfdf border=1 class=formarea>";
	str+="<tbody><tr>";
	str+="<td class=bc_tb><div align=\"center\">"+"MAC Address"+"</div></td>";
	str+="<td class=bc_tb><div align=\"center\">"+"IPv6 Address"+"</div></td>";
	str+="<td width=\"50\" class=bc_tb>"+"Remove"+"</td>";
	str+="<td width=\"50\" class=bc_tb>"+"Edit"+"</td>";
	str+="</tr>";
	if(mac_datacount)
	{
		for (var i=0; i<datalist_dhcpv6_assign_ip_by_mac.length; i++)
		{
			str+="<tr>";
			str+="<td align=center>" +datalist_dhcpv6_assign_ip_by_mac[i][0]+ "</td>";
			str+="<td align=center>" + dhcpv6_lan_prefix + "00" + datalist_dhcpv6_assign_ip_by_mac[i][1] + "</td>";
			str+='<td  align=center><input type="checkbox" id=mac_enable_'+i+' name=mac_enable_'+i+'></td>';
			str+='<td  align=center><input type="radio" id=edit_mac_'+i+' name="edit_mac" onClick="Edit_mac_Row('+i+')"></td>';
			str+="</tr>";
		}
	}
	else
	{
		str+="<tr><td colspan=4 align=center bgcolor=white>"+"No entry!"+"</td></tr>";
	}
	str+="</tbody></table>";
		str+="<p align=center><input type='button' name='mac_apply' value='Remove Selected' onClick='do_mac_delete()'></p>";
	
	str+="</div>";
	return str;
}

function gen_port_table()
{
	var f = $("frm");
	var dhcpv6_lan_prefix = "";
	dhcpv6_lan_prefix = ipv6lanside.pdaddr_beg;
	if(dhcpv6_lan_prefix == "" && pd_prefix != "")
		dhcpv6_lan_prefix = pd_prefix;
	else if(dhcpv6_lan_prefix == "" && pd_prefix == "")
		dhcpv6_lan_prefix = "::";
	var str="";
	str+="<div class=box>";
	str+="<h2>"+"IPv6 Address Range Assigned to Lan Interface"+"</h2>";
	str+="<table borderColor=#ffffff cellSpacing=1 cellPadding=2 width=525 bgColor=#dfdfdf border=1 class=formarea>";
	str+="<tbody><tr>";
	str+="<td class=bc_tb><div align=\"center\">"+"LAN Interface"+"</div></td>";
	str+="<td class=bc_tb><div align=\"center\">"+"IPv6 Address Range"+"</div></td>";
	str+="<td width=\"50\" class=bc_tb>"+"Remove"+"</td>";
	str+="<td width=\"50\" class=bc_tb>"+"Edit"+"</td>";
	str+="</tr>";
	if(port_datacount)
	{
		for (var i=0; i<datalist_dhcpv6_assign_ip_by_port.length; i++)
		{
			str+="<tr>";
			str+="<td align=center>";
			switch(datalist_dhcpv6_assign_ip_by_port[i][0])
			{
				case "eth0.0":
					str+="Port2";
					break;
				case "eth1.0":
					str+="Port3";
					break;
				case "eth2.0":
					str+="Port4";
					break;
				case "eth3.0":
					str+="Port1";
					break;
				case "wl0":
					str+="SSID1";
					break;
				case "wl0.1":
					str+="SSID2";
					break;
				case "wl0.2":
					str+="SSID3";
					break;
				case "wl0.3":
					str+="SSID4";
					break;
				default:
					str+="Unknown";
					break;
			}
			str+="</td>";
			str+="<td align=center> Start : "+ dhcpv6_lan_prefix + datalist_dhcpv6_assign_ip_by_port[i][1]+ "01<br> End : "+ dhcpv6_lan_prefix + datalist_dhcpv6_assign_ip_by_port[i][1] + "ff</td>";
			str+='<td  align=center><input type="checkbox" id=port_enable_'+i+' name=port_enable_'+i+'></td>';
			str+='<td  align=center><input type="radio" id=edit_port_'+i+' name="edit_port" onClick="Edit_port_Row('+i+')"></td>';
			str+="</tr>";
		}
	}
	else
	{
		str+="<tr><td colspan=4 align=center bgcolor=white>"+"No entry!"+"</td></tr>";
	}
	str+="</tbody></table>";
		str+="<p align=center><input type='button' name='port_apply' value='Remove Selected' onClick='do_port_delete()'></p>";
	str+="</div>";
	return str;
}

function gen_add_mac_table()
{
	var f = $("frm");
	var str="";
	str+="<div class=box>";
	str+="<h2>"+"Add Static IPv6 Address"+"</h2>";
	str+="<table class=formarea cellSpacing=0 cellPadding=0 summary='' width=525>";
	str+="<input type=hidden name=edit_mac_row value='-1'>"
	str+="<tr><td width=50>&nbsp;</td>";
	str+="<td class=form_label width=200>"+"MAC Address :"+"</td>";
	str+="<td class=''>&nbsp;"
	str+="<INPUT class=tabdata name=lan_dhcpv6_macAddress maxlength='17' value=''>"+" (xx:xx:xx:xx:xx:xx)";
	str+="</td></tr>";	
	str+="<tr><td width=50>&nbsp;</td>";
	str+="<td class=form_label width=200>"+"IPv6 Address :"+"</td>";
	str+="<td class=''>&nbsp;";
	str+="<INPUT class=tabdata name=mac_dhcpv6_prefix size='22' maxlength='21' disabled='ture'>00<INPUT class=tabdata name=lan_dhcpv6_ipv6address size='3' maxlength='2' value=''>"+" ("+ipv6lanside.pdaddr_beg_postfix+" ~ "+ipv6lanside.pdaddr_end_postfix+")";
	str+="</td></tr></table>";
	str+="<p align=center>";
	str+="<INPUT name='button1' type=button class=button_submit onclick='by_mac_submit()'; value='Add'>";
	str+="<INPUT name='button2' type=button class=button_submit onclick='by_mac_click()'; value='Cancel'>";
	str+="</p></div>";
	return str;
}

function gen_add_port_table()
{
	var f = $("frm");
	var str="";
	str+="<div class=box>";
	str+="<h2>"+"Add LAN IPv6 Address Pool"+"</h2>";
	str+="<table class=formarea cellSpacing=0 cellPadding=0 summary='' width=525>";
	str+="<input type=hidden name=edit_port_row value='-1'>"
	str+="<tr><td width=50>&nbsp;</td>";
	str+="<td class=form_label width=200>"+"LAN Interface :"+"</td>";
	str+="<td class=''>&nbsp;"
	str+= "<select id='dhcpv6_interface' name='dhcpv6_interface'>";
	str+="<option value='eth3.0'>Port1</option>";
	str+="<option value='eth0.0'>Port2</option>";
	str+="<option value='eth1.0'>Port3</option>";
	str+="<option value='eth2.0'>Port4</option>";
	str+="<option value='wl0'>SSID1</option>";
	str+="<option value='wl0.1'>SSID2</option>";
	str+="<option value='wl0.2'>SSID3</option>";
	str+="<option value='wl0.3'>SSID4</option>";
	str+= "</select></td></tr>";
	str+="<tr><td width=50>&nbsp;</td>";
	str+="<td class=form_label width=200>"+"IPv6 Address Range :"+"</td>";
	str+="<td class=''>&nbsp;";
	str+="<INPUT class=tabdata name=port_dhcpv6_prefix size='22' maxlength='21' disabled='ture'> <INPUT class=tabdata name=lan_dhcpv6_pool size='3' maxlength='2' value=''>00  (01 ~ ff)";
	str+="</td></tr>";
	str+="</table>";
	str+="<p align=center>";
	str+="<INPUT name='button3' type=button class=button_submit onclick='by_port_submit()'; value='Add'>";
	str+="<INPUT name='button4' type=button class=button_submit onclick='by_port_click()'; value='Cancel'>";
	str+="</p></div>";
	return str;
}

function Edit_mac_Row(r)
{
	var f = $("frm");
	f.edit_mac_row.value=r;
	
	f.lan_dhcpv6_macAddress.value = datalist_dhcpv6_assign_ip_by_mac[r][0];
	f.lan_dhcpv6_ipv6address.value = datalist_dhcpv6_assign_ip_by_mac[r][1];
}

function Edit_port_Row(r)
{
	var f = $("frm");
	f.edit_port_row.value=r;
	
	f.dhcpv6_interface.value = datalist_dhcpv6_assign_ip_by_port[r][0];
	f.lan_dhcpv6_pool.value = datalist_dhcpv6_assign_ip_by_port[r][1];
}

function do_mac_delete()
{
	var url=do_url();
	var f = $("frm");
	var idx = f.inf_name.value;
	var delTmp = 0;
	
	url+="&set/ipv6lanside/dhcpv6_assign_ip_by_mac/enable=1";
	for(var i=mac_datacount-1; i>-1; i--)
	{
		if(get_obj("mac_enable_"+i).checked == true)
		{
			url+="&del/ipv6lanside/dhcpv6_assign_ip_by_mac/rule:"+(i+1)+"=1";
			delTmp = 1;
		}
	}
	if(delTmp == 1)
	{
		if(confirm(m_del_msg)==true)
		{
			url+="&CMT=0";
			url+="&"+"EXE=dhcp6s,br0";
			self.location.href=url;
		}
		else
			return ;
	}
	else
		return ;
}

function do_port_delete()
{
	var url=do_url();
	var f = $("frm");
	var idx = f.inf_name.value;
	var delTmp = 0;
	
	url+="&set/ipv6lanside/dhcpv6_assign_ip_by_port/enable=1";
	for(var i=port_datacount-1; i>-1; i--)
	{
		if(get_obj("port_enable_"+i).checked == true)
		{
			url+="&del/ipv6lanside/dhcpv6_assign_ip_by_port/rule:"+(i+1)+"=1";
			delTmp = 1;
		}
	}
	if(delTmp == 1)
	{
		if(confirm(m_del_msg)==true)
		{
			url+="&CMT=0";
			url+="&"+"EXE=dhcp6s,br0";
			self.location.href=url;
		}
		else
			return ;
	}
	else
		return ;
}

function by_mac_submit()
{
	var url=do_url();
	var f = $("frm");
	var idx = f.inf_name.value;
	if(f.edit_mac_row.value=="-1")
	{
		edit_mac_row = (mac_datacount+1);
		if((mac_datacount+1) > mac_entry_limit)
		{
			alert("The sum of entry cannot over 32.");
			return false;
		}
	}
	else
		edit_mac_row=parseInt(f.edit_mac_row.value)+1;
	var m=f.lan_dhcpv6_macAddress.value;
	/*Check MAC*/
	if(m!="")
	{
		if (m.search(":") != -1)
			var tmp=m.split(":");
		else
		{
			dx_alert_error_message(f.lan_dhcpv6_macAddress, "Invalid MAC Address.");
			return false;
		}
		if (!(checkMAC(tmp[0])&&checkMAC(tmp[1])&&checkMAC(tmp[2])&&checkMAC(tmp[3])&&checkMAC(tmp[4])&&checkMAC(tmp[5])))
		{
			dx_alert_error_message(f.lan_dhcpv6_macAddress, "Invalid MAC Address.");
			return false;
		}
		if ((m == "00:00:00:00:00:00") || (parseInt(tmp[0],16)%2 == 1))
		{
			dx_alert_error_message( f.lan_dhcpv6_macAddress, "Invalid MAC Address.");
			return false;
		}
	}
	else
	{
		dx_alert_error_message(f.lan_dhcpv6_macAddress, "MAC Address should not be empty.");
		return false;
	}
	/*Check IPv6 Address*/
	if(f.lan_dhcpv6_ipv6address.value.length ==0)
	{
		dx_alert_error_message(f.lan_dhcpv6_ipv6address,"The value can't be empty.");
		return false;
	}
	if(!isHex(f.lan_dhcpv6_ipv6address.value) || parseInt(f.lan_dhcpv6_ipv6address.value,16) < parseInt(ipv6lanside.pdaddr_beg_postfix,16) || parseInt(f.lan_dhcpv6_ipv6address.value,16) > parseInt(ipv6lanside.pdaddr_end_postfix,16))
	{
		dx_alert_error_message(f.lan_dhcpv6_ipv6address,"The value out of range. Range between"+ipv6lanside.pdaddr_beg_postfix+" - "+ipv6lanside.pdaddr_end_postfix);
		return false;
	}
	/*Check existed rules*/
	if(mac_datacount!=0)
	{
		for(i=0; i<mac_datacount; i++)
		{
			if(edit_mac_row!=(i+1))
			{
				/*Check MAC*/
				var n=datalist_dhcpv6_assign_ip_by_mac[i][0];
				if (n.search(":") != -1)
					var tmp2=n.split(":");
				if((tmp[0].toLowerCase()==tmp2[0].toLowerCase())&&(tmp[1].toLowerCase()==tmp2[1].toLowerCase())&&(tmp[2].toLowerCase()==tmp2[2].toLowerCase())&&(tmp[3].toLowerCase()==tmp2[3].toLowerCase())&&(tmp[4].toLowerCase()==tmp2[4].toLowerCase())&&(tmp[5].toLowerCase()==tmp2[5].toLowerCase()))
				{
					dx_alert_error_message(f.lan_dhcpv6_macAddress, "An IPv6 address is already assigned to this MAC Address.");
					return false;
				}
				/*Check IPv6 address*/
				if(parseInt(f.lan_dhcpv6_ipv6address.value,16) == parseInt(datalist_dhcpv6_assign_ip_by_mac[i][1],16))
				{
					dx_alert_error_message(f.lan_dhcpv6_ipv6address,"This IPv6 address is already assigned to other MAC.");
					return false;
				}
			}
		}
	}
	url+="&set/ipv6lanside/dhcpv6_assign_ip_by_mac/enable=1";
	url+="&set/ipv6lanside/dhcpv6_assign_ip_by_mac/rule:"+edit_mac_row+"/mac="+f.lan_dhcpv6_macAddress.value;
	url+="&set/ipv6lanside/dhcpv6_assign_ip_by_mac/rule:"+edit_mac_row+"/postfix="+f.lan_dhcpv6_ipv6address.value;
	url+="&CMT=0";
	url+="&"+"EXE=dhcp6s,br0";
	self.location.href=url;
}

function by_port_submit()
{
	var url=do_url();
	var f = $("frm");
	var idx = f.inf_name.value;
	if(f.edit_port_row.value=="-1")
	{
		edit_port_row = (port_datacount+1);
		if((port_datacount+1) > port_entry_limit)
		{
			alert("The sum of entry cannot over 8.");
			return false;
		}
	}
	else
		edit_port_row=parseInt(f.edit_port_row.value)+1;
	/*Check IPv6 Address*/
	if(f.lan_dhcpv6_pool.value.length ==0)
	{
		dx_alert_error_message(f.lan_dhcpv6_pool,"The value can't be empty.");
		return false;
	}
	if(!isHex(f.lan_dhcpv6_pool.value) || parseInt(f.lan_dhcpv6_pool.value,16) < 0x1 || parseInt(f.lan_dhcpv6_pool.value,16) > 0xff)
	{
		dx_alert_error_message(f.lan_dhcpv6_pool,m_range_prefix);
		return false;
	}
	/*Check existed rules*/
	if(port_datacount!=0)
	{
		for(i=0; i<port_datacount; i++)
		{
			if(edit_port_row!=(i+1))
			{
				/*Check port*/
				if(f.dhcpv6_interface.value == datalist_dhcpv6_assign_ip_by_port[i][0])
				{
					alert("An IPv6 address range is already assigned to this LAN interface.");
					return false;
				}
				/*Check IPv6 address*/
				if(parseInt(f.lan_dhcpv6_pool.value,16) == parseInt(datalist_dhcpv6_assign_ip_by_port[i][1],16))
				{
					dx_alert_error_message(f.lan_dhcpv6_pool,"This IPv6 address range is already assigned to other LAN interface.");
					return false;
				}
			}
		}
	}
	url+="&set/ipv6lanside/dhcpv6_assign_ip_by_port/enable=1";
	url+="&set/ipv6lanside/dhcpv6_assign_ip_by_port/rule:"+edit_port_row+"/port="+f.dhcpv6_interface.value;
	url+="&set/ipv6lanside/dhcpv6_assign_ip_by_port/rule:"+edit_port_row+"/postfix="+f.lan_dhcpv6_pool.value;
	url+="&CMT=0";
	url+="&"+"EXE=dhcp6s,br0";
	self.location.href=url;
}

function checkMAC(m)
{
	var allowChar="01234567890ABCEDF";
	if(m==null)
		return false;
	if(m.length!=2)
		return false;
	m=m.toUpperCase();
	for (var i=0; i < m.length; i++)
	{
		if (allowChar.indexOf(m.charAt(i)) == -1) return false;
	}
	if (m.length==0) return false;
	return true;
}
SPRE_ENDIF>
</script>

