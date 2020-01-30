defmodule Console.Organizations.OrganizationResolver do
  alias Console.Repo
  alias Console.Organizations.Membership
  alias Console.Organizations

  def find(%{id: id}, %{context: %{current_user: current_user}}) do
    organization = Organizations.get_organization!(current_user, id)
    {:ok, organization}
  end

  def all(_, %{context: %{current_user: current_user}}) do
    organizations = Organizations.get_organizations(current_user)
    {:ok, organizations}
  end
end
