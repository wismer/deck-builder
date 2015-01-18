class Card < ActiveRecord::Base
  belongs_to :expansion
  has_one :expansion

  self.primary_key = "multiverseid"

  def flying?
    self.card_text.nil? ? false : self.card_text.split("\n").any? { |line| line =~ /Flying/ }
  end

  def card_types
    super.split(", ") if super
  end

  def card_colors
    super || ""
  end

  def card_subtype
    super.split(", ") if super
  end

  def supertypes
    super.split(", ") if super
  end

  def creature?
    self.card_type === "Creature"
  end

  def reform
    { isCreature: creature? }
  end

  def mana_cost
    if super
      super.split(/[\{\}]/).select { |x| x.length > 0 }.map do |mana|
        case mana
        when "G"
          "Green"
        when "U"
          "Blue"
        when "W"
          "White"
        when "B"
          "Black"
        when "R"
          "Red"
        else
          mana
        end
      end
    else
      []
    end
  end
end
