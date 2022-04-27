from server.HdMWebAppAdministration import HdMWebAppAdministration

hwa = HdMWebAppAdministration()
person = hwa.get_person_by_id(1)

print(person)