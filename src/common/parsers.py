"""HTML parsers for GitHub form extraction."""

from html.parser import HTMLParser


class FormParser(HTMLParser):
    """Extract hidden fields from a form whose action matches a given string."""

    def __init__(self, action_match="/session"):
        super().__init__()
        self.action_match = action_match
        self.hidden_fields = {}
        self.in_form = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "form":
            action = attrs_dict.get("action", "")
            if self.action_match in action:
                self.in_form = True
        if tag == "input" and self.in_form:
            input_type = attrs_dict.get("type", "")
            name = attrs_dict.get("name", "")
            value = attrs_dict.get("value", "")
            if input_type == "hidden" and name:
                self.hidden_fields[name] = value

    def handle_endtag(self, tag):
        if tag == "form" and self.in_form:
            self.in_form = False


class AuthTokenParser(HTMLParser):
    """Extract the first authenticity_token from any page."""

    def __init__(self):
        super().__init__()
        self.token = None

    def handle_starttag(self, tag, attrs):
        if tag == "input" and self.token is None:
            attrs_dict = dict(attrs)
            if attrs_dict.get("name") == "authenticity_token":
                self.token = attrs_dict.get("value", "")


class AllFormsParser(HTMLParser):
    """Extract all forms and their input fields from a page."""

    def __init__(self):
        super().__init__()
        self.forms = []       # [{action, method, fields: {name: value}}]
        self._current = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "form":
            self._current = {
                "action": attrs_dict.get("action", ""),
                "method": attrs_dict.get("method", "GET").upper(),
                "fields": {},
            }
        if tag == "input" and self._current is not None:
            name = attrs_dict.get("name", "")
            value = attrs_dict.get("value", "")
            input_type = attrs_dict.get("type", "").lower()
            if name:
                if input_type == "radio":
                    if "checked" in attrs_dict:
                        self._current["fields"][name] = value
                    elif name not in self._current["fields"]:
                        pass
                else:
                    self._current["fields"][name] = value

    def handle_endtag(self, tag):
        if tag == "form" and self._current is not None:
            self.forms.append(self._current)
            self._current = None
