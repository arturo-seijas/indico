<script type="text/javascript">

function showAbstracts()
{
    var listOfAbstracts = <%= listOfAbstracts %>;
    var div = Html.div({});
    for (a in listOfAbstracts)
    {
        div.append(listOfAbstracts[a]);
        div.append(Html.br());
    }
    var popup = new AlertPopup(Html.span('warningTitle', "List of abstracts"), div);
    popup.open();
}


</script>


<table width="50%%" align="center" border="0" style="border-left: 1px solid #777777">
    <tr>
        <td class="groupTitle"><%= _("Accepting abstract")%><a href="javascript:showAbstracts()">(%(abstractsQuantity)s)</a></td>
    </tr>
    <tr>
        <td bgcolor="white">
            <table>
                <tr>
                    <form action=%(acceptURL)s method="POST">
                    <td nowrap class="titleCellTD"><span class="titleCellFormat"><%= _("Comments")%></span></td>
                    <td><textarea name="comments" rows="6" cols="50"></textarea></td>
                </tr>
                <tr>
                    <td nowrap class="titleCellTD"><span class="titleCellFormat"><%= _("Destination track")%></span></td>
                    <td>
                        <select name="track">
                            <option value="conf">--<%= _("no track") %>--</option>
                            <% for t in tracks: %>
                                <option value=<%= t.getId() %> > <%= t.getTitle() %> </option>
                            <% end %>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td nowrap class="titleCellTD"><span class="titleCellFormat"><%= _("Destination session")%></span></td>
                    <td>
                        <select name="session">
                                <option value="conf">--<%= _("no session") %>--</option>
                                <% for session in sessions: %>
                                    <option value=<%= session.getId() %> ><%= session.getTitle() %></option>
                                <% end %>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td nowrap class="titleCellTD"><span class="titleCellFormat"><%= _("Type of contribution")%></span></td>
                    <td>
                        <select name="type">
                            <option value="not_defined">--<%= _("not defined") %>--</option>
                            <% for type in self._conf.getContribTypeList(): %>
                                <option value=<%= type.getId() %> ><%= type.getName() %></option>
                            <% end %>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td nowrap class="titleCellTD"><span class="titleCellFormat"><%= _("Email Notification")%></span></td>
                    <td>
                        <input type="checkbox" name="notify" value="true" checked><%= _(" Automatic Email Notification")%>
                    </td>
                </tr>
            </table>
            <br>
        </td>
    </tr>
    <tr>
        <td valign="bottom" align="left">
            <table valign="bottom" align="left">
                <tr>
                    <td valign="bottom" align="left">
                        <input type="submit" class="btn" name="accept" value="<%= _("accept")%>">
                    </td>
                    </form>
                    <form action=%(cancelURL)s method="POST">
                    <td valign="bottom" align="left">
                        <input type="submit" class="btn" name="cancel" value="<%= _("cancel")%>">
                    </td>
                    </form>
                </tr>
            </table>
        </td>
    </tr>
</table>
